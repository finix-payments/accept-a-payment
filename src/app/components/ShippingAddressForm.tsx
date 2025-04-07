'use client';

import { useState } from 'react';
import { shippingAddressFormCode } from './inspector/code/ShippingAddressFormCode';

interface ShippingAddressFormProps {
  onAddressChange: (address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => void;
}

export default function ShippingAddressForm({ onAddressChange }: ShippingAddressFormProps) {
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newAddress = { ...address, [name]: value };
    setAddress(newAddress);
    onAddressChange(newAddress);
  };

  const inputClassName = "mt-1 block w-full h-[42px] px-2 rounded-md border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100";

  return (
    <div className="mb-8" data-inspectable data-component="ShippingAddressForm.tsx" data-code={shippingAddressFormCode}>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Shipping Address</h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="line1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address Line 1
          </label>
          <input
            type="text"
            id="line1"
            name="line1"
            required
            placeholder="Address Line 1"
            className={inputClassName}
            value={address.line1}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="line2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address Line 2
          </label>
          <input
            type="text"
            id="line2"
            name="line2"
            placeholder="Address Line 2"
            className={inputClassName}
            value={address.line2}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              placeholder="City"
              className={inputClassName}
              value={address.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ZIP Code
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              required
              placeholder="ZIP"
              className={inputClassName}
              value={address.zip}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State
            </label>
            <select
              id="state"
              name="state"
              required
              className={inputClassName}
              value={address.state}
              onChange={handleChange}
            >
              <option value="">Select a state</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <select
              id="country"
              name="country"
              required
              className={inputClassName}
              value={address.country}
              onChange={handleChange}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 