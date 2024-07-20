import Form from "../components/Form";
import { Link } from "react-router-dom";

function Register() {
    return (
        <div>
            <Form route="/api/user/register/" method="register" />
            <div className="link-container">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}

export default Register;
