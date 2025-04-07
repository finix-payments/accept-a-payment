declare global {
    interface Window {
        Finix?: {
            TokenForm: (id: string, options: any) => any;
            CardTokenForm: (id: string, options: any) => any;
            BankTokenForm: (id: string, options: any) => any;
        };
    }
}

export interface FinixForm {
    submit: (env: string, key: string, callback: (err: any, res: TokenResponse) => void) => void;
}

export interface TokenResponse {
    data: {
        id: string;
    };
}

export {};
