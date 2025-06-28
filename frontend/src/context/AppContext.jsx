import axios from 'axios';
import { createContext, use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider =(props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);

    const navigate = useNavigate();

    const loadCreditsData = async() => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: {token}});

            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            } else {
                toast.error(data.message || 'Failed to load credits');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred while loading credits');
        }
    }

    const generateImage = async(prompt) => {
        try {
            const {data} =await axios.post(backendUrl + '/api/image/generate-image', { prompt }, { headers: { token } });
            if(data.success) {
                toast.success('Image generated successfully'); 
                loadCreditsData(); // Reload credits after image generation
                return data.resultImage; // Assuming the response contains the image URL
            } else {
                toast.error(data.message || 'Image generation failed');
                console.log(data);
                loadCreditsData(); // Reload credits to reflect any changes
                if (data.creditBalance === 0) {
                    navigate('/buy-credit');
                }
            }
        } catch (error) {
            console.error('Error generating image:', error.response);
            toast.error(error.message || 'An error occurred while generating image');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(false);
        setCredit(false);
    }

    useEffect(() => {
        if (token) {
            loadCreditsData();
        } else {
            setCredit(false);
            setUser(false);
        }
    },[token])

    const value = {
        user, setUser, showLogin, setShowLogin, token, setToken, credit, setCredit, backendUrl, loadCreditsData, logout, generateImage
    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;