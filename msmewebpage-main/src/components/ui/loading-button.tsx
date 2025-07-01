import * as React from "react"
import { Button } from "./button"
import { Loader2 } from "lucide-react"
import { ButtonProps } from "./button"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading, ...props }, ref) => {
    return (
      <Button {...props} ref={ref} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
