import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOffIcon } from '@/components/IconComponents';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <Card className="text-center flex flex-col items-center justify-center h-full">
        <CardHeader>
            <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                <WifiOffIcon className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive mt-4">An Error Occurred</CardTitle>
            <CardDescription>
                We couldn't generate your plan.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">{message}</p>
            <Button onClick={onRetry}>Try Again</Button>
        </CardContent>
    </Card>
  );
};

export default ErrorState;
