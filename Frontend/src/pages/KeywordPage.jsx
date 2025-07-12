import { useSearchParams } from "react-router-dom";

function KeywordPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  return (
    <div>
      <h1>Results for: {keyword}</h1>
      {/* render results */}
    </div>
  );
}

export default KeywordPage;
