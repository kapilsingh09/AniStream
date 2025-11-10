import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccesTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccesToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

//  should use process.env.JWT_SECRET in production
const JWT_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "your_secret_keyds@@@fjkalsdjfodjsiofj121io8936217846hkhfkjdsaf fklsjdfoief fnasf.HIUY689q3wfY(^(3u jfoijofhgaU967w3r9uiofji)) weur37u28547fjY(^&#%(#&$($ #($&#heheh R OHFK#(*RY FH( #Y$(#&FFFFF";

// Register Controller
export const register = async (req, res) => {
  try {
    const {  name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      // username,
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "ok" });
});

// Login Controller
export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required ");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials ");
  }

  const { accessToken, refreshToken } =
    await generateAccesTokenAndRefreshTokens(user._id);

  // ✅ added await to actually fetch user from DB
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken" // ✅ lowercase refreshToken (your code had capital R)
  );

  const cookieAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000
    : 60 * 60 * 1000;

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: cookieAge,
  };

  return res
    .status(200)
    // ✅ fixed typo `.cokkie` → `.cookie`
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookies or request body
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request - No refresh token");
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET
    );

    // Find user by ID from decoded token
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Check if the refresh token matches the one stored in database
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccesTokenAndRefreshTokens(user._id);

    const cookieAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: cookieAge,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true } // ✅ fixed misplaced options
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  return res
    .status(200)
    // ✅ clearCookie does NOT take rememberMe
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
