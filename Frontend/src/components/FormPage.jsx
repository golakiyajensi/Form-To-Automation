import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const FormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ padding: "30px" }}>
            <h2>Form Page</h2>
            <p>You opened form: <strong>{id}</strong></p>



        </div >
    );
};

export default FormPage;
