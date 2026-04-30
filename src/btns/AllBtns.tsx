interface btnsProps {
    text: string;
    onClick?: () => void;
}

export const SolidBtn = ({ text, onClick }: btnsProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '12px 24px',
                background: '#FBC607',
                color: '#000',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(251,198,7,0.25)',
            }}
            className="w-full"
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(251,198,7,0.35)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(251,198,7,0.25)';
            }}
        >
            {text}
        </button>
    );
};

export const GrayBtn = ({ text, onClick }: btnsProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
        >
            {text}
        </button>
    );
};