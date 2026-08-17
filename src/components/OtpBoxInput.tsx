import React, { useRef, useEffect } from 'react';

interface OtpBoxInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: boolean;
}

export default function OtpBoxInput({
  length = 4,
  value,
  onChange,
  error = false,
}: OtpBoxInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Focus first empty box on mount
  useEffect(() => {
    if (inputRefs.current[0] && !value) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    // Allow only digits
    if (val && !/^[0-9]+$/.test(val)) return;

    const currentOtpArray = value.padEnd(length, ' ').split('').slice(0, length);
    // Take the last entered character if multiple characters typed
    const digit = val.substring(val.length - 1);
    currentOtpArray[index] = digit || ' ';

    const newOtp = currentOtpArray.join('').trimEnd();
    onChange(newOtp);

    // Auto-focus next input box if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const currentOtpArray = value.padEnd(length, ' ').split('').slice(0, length);

      if (!currentOtpArray[index] || currentOtpArray[index] === ' ') {
        // Move to previous input box on backspace if current is empty
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current box digit
        currentOtpArray[index] = ' ';
        onChange(currentOtpArray.join('').trimEnd());
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    // Filter digits only
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, length);

    if (digitsOnly) {
      onChange(digitsOnly);
      const nextFocusIndex = Math.min(digitsOnly.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const otpDigits = Array.from({ length }, (_, i) => value[i] || '');

  return (
    <div className="flex items-center justify-start gap-3 sm:gap-4 my-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otpDigits[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-14 h-14 sm:w-10 sm:h-10 text-center text-2xl font-extrabold rounded-2xl border-2 outline-none transition-all duration-200 shadow-sm bg-gray-50/60 hover:bg-gray-50 focus:bg-white
            ${error
              ? '!border-red-500 text-red-600 bg-red-50/30 focus:!border-red-500 focus:ring-4 focus:ring-red-500/20'
              : otpDigits[index]
                ? 'border-[#2E3192] text-[#2E3192] bg-blue-50/30 ring-4 ring-[#2E3192]/10'
                : 'border-gray-200 text-gray-900 focus:border-[#2E3192] focus:ring-4 focus:ring-[#2E3192]/15'
            }`}
        />
      ))}
    </div>
  );
}
