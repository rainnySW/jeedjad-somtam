import { useState, useEffect } from 'react';

export default function TransitionLayout({ children }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  
  useEffect(() => {
    if (children.key !== displayChildren.key) {
      setTransitionStage('fadeOut');
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [children, displayChildren.key]);

  return (
    <div className={`w-full h-full min-h-screen transition-all duration-400 ease-out ${transitionStage === 'fadeIn' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'}`}>
      {displayChildren}
    </div>
  );
}
