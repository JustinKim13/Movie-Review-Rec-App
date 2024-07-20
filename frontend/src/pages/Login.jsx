import Form from "../components/Form";
import { Link } from "react-router-dom";

function Login() {
    return (
        <div>
            <Form route="/api/token/" method="login" />
            <div className="link-container">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
}

export default Login;
