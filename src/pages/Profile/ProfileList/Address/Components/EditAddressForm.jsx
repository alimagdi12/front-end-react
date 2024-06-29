import React, { useContext, useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import ColorContext from '../../../../../contexts/ColorContext';
import { AddressContext } from "../../../../../contexts/AddressContext";
import UserContext from '../../../../../contexts/UserContext';

const EditAddressForm = ({ open, handleClose, address }) => {
    const { color } = useContext(ColorContext);
    const { editAddress, fetchAddresses } = useContext(AddressContext);
    const { userData } = useContext(UserContext);

    const [formData, setFormData] = useState({
        userId:address.userId._id,
        id: address._id,
        name: '',
        street: '',
        city: '',
        zone: '',
        country: '',
    });

    useEffect(() => {
        fetchAddresses()
    }, [address]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await editAddress(address._id, formData);
        await fetchAddresses()
        setFormData(formData)
        handleClose();
    };

    if (!open) return null;

    return (
        <Container component="main">
            <Paper style={{ padding: 20 }}>
                <Typography variant="h5" gutterBottom>
                    Edit Address
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="street"
                        label="Street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="country"
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="zip"
                        label="ZIP"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                    />
                    <Button
                        sx={{ backgroundColor: color, "&:hover": { color: color, backgroundColor: 'white', outline: `2px solid ${color}` } }}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditAddressForm;