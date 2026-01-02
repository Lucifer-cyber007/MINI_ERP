import './MetricCard.css';

const MetricCard = ({ title, value, change, icon: Icon, variant = 'default' }) => {
    const getVariantClass = () => {
        if (variant === 'warning') return 'metric-warning';
        if (variant === 'success') return 'metric-success';
        return '';
    };

    return (
        <div className={`metric-card ${getVariantClass()}`}>
            <div className="metric-header">
                <span className="metric-title">{title}</span>
            </div>
            <div className="metric-content">
                <div className="metric-value">{value}</div>
                {change && (
                    <div className={`metric-change ${change.type}`}>
                        {change.icon && <span>{change.icon}</span>}
                        <span>{change.text}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;
