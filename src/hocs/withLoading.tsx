import React from "react";
import { Loader2 } from "lucide-react";

interface WithLoadingProps {
  isLoading: boolean;
  loadingText?: string;
}

const withLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P & WithLoadingProps) => {
    const { isLoading, loadingText, ...restProps } = props;
    return (
      <>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[200px] py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            {loadingText && <p>{loadingText}</p>}
          </div>
        ) : (
          <WrappedComponent {...(restProps as P)} />
        )}
      </>
    );
  };
};

export default withLoading;
