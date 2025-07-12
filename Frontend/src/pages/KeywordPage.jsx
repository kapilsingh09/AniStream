import { useSearchParams } from 'react-router-dom';

function KeywordPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

  return (
    <div className='flex text-center justify-center items-center text-8xl'>
      <h1>Searching for: {keyword}</h1>
      {/* render search results... */}
    </div>
  );
}

export default KeywordPage;
