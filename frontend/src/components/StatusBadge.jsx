const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status?.toUpperCase()) {
            case 'DRAFT':
                return 'status-draft';
            case 'CONFIRMED':
                return 'status-confirmed';
            case 'CANCELLED':
                return 'status-cancelled';
            default:
                return 'status-draft';
        }
    };

    return (
        <span className={`status-badge ${getStatusClass()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
