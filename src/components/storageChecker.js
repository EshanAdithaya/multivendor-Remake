import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const StorageChecker = () => {
    const [hasAccessToken, setHasAccessToken] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setHasAccessToken(true);
        } else {
            alert('You have to login to perform this task');
            history.push('/login');
        }
    }, [history]);

    return (
        <div>
            {hasAccessToken ? 'Access Token is present' : 'No Access Token found'}
        </div>
    );
};

export default StorageChecker;
