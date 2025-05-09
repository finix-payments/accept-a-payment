interface FieldState {
    isFocused: boolean;
    isDirty: boolean;
    errorMessages: string[];
  }
  
  interface AddressCountryState extends FieldState {
    selected: string;
    country: string;
  }
  
  interface AddressRegionState extends FieldState {
    selected: string;
  }
  
  export interface FormState {
    'address.city': FieldState;
    'address.country': AddressCountryState;
    'address.line1': FieldState;
    'address.line2': FieldState;
    'address.postal_code': FieldState;
    'address.region': AddressRegionState;
    'expiration_date': FieldState;
    'name': FieldState;
    'number': FieldState;
    'security_code': FieldState;
  }

  interface BinInformation {
    brand?: string;
    type?: string;
    category?: string;
  }
  
  interface PaymentResponse {
    id: string;
    status: string;
    amount: number;
    currency: string;
  }
  
  export interface PaymentFormProps {
    onSuccess?: (data: PaymentResponse) => void;
    shippingAddress: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  }
  
  export interface FinixFormOptions {
    showAddress?: boolean;
    requiredFields?: string[];
    onUpdate?: (state: FormState, binInformation: BinInformation, hasErrors: boolean) => void;
    styles?: {
      default?: {
        border?: string;
        borderRadius?: string;
        padding?: string;
        fontSize?: string;
        fontWeight?: string;
        lineHeight?: string;
        color?: string;
        backgroundColor?: string;
        boxShadow?: string;
        [key: string]: string | undefined;
      };
      [key: string]: { [key: string]: string | undefined } | undefined;
    };
  }
  
  export interface BinInformation {
    brand?: string;
    type?: string;
    category?: string;
  }
  
  export interface TokenError {
    message: string;
    code?: string;
    details?: unknown;
  }
  
  declare global {
    interface Window {
      Finix?: {
        TokenForm: (id: string, options: FinixFormOptions) => FinixForm;
        CardTokenForm: (id: string, options: FinixFormOptions) => FinixForm;
        BankTokenForm: (id: string, options: FinixFormOptions) => FinixForm;
      };
    }
  }
  
  export interface FinixForm {
    submit: (env: string, key: string, callback: (err: TokenError | null, res: TokenResponse) => void) => void;
  }
  
  export interface TokenResponse {
    data: {
      id: string;
      // Add other response fields if available
    };
  }
  
  export {};