import React from 'react';

interface PasswordRulesProps {
    password: string;
}

const PasswordRules: React.FC<PasswordRulesProps> = ({ password }) => {
    const rules = [
        {
            label: '8 caractères minimum',
            isValid: password.length >= 8,
        },
        {
            label: 'Au moins une majuscule',
            isValid: /[A-Z]/.test(password),
        },
        {
            label: 'Au moins un caractère spécial',
            isValid: /[^a-zA-Z0-9]/.test(password),
        },
        {
            label: 'Au moins un chiffre',
            isValid: /\d/.test(password),
        },
    ];

    return (
        <ul className="password-rules">
            {rules.map((rule, index) => (
                <li
                    key={index}
                    className={rule.isValid ? 'valid-rule rule' : 'invalide-rule rule'}
                >
                    {rule.label}
                </li>
            ))}
        </ul>

    );
};

export default PasswordRules;
