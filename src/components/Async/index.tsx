import { useEffect, useState } from 'react';

export const Async = () => {
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsButtonInvisible(true);
    }, 1000);
  }, []);
  return (
    <div>
      <div>Hello World</div>
      {!isButtonInvisible && <button>Button</button>}
    </div>
  );
};
