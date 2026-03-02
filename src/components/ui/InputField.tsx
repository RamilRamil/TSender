interface InputFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    type?: string;
    large?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
    label,
    placeholder,
    value,
    type = "text",
    large = false,
    disabled = false,
    readOnly = false,
    onChange,
}: InputFieldProps) {
    const baseClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 read-only:bg-gray-50 read-only:cursor-default";
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {large ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    rows={5}
                    className={`${baseClass} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={baseClass}
                />
            )}
        </div>
    );
}
