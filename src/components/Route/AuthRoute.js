import { Redirect, Route } from "react-router-dom";

const AuthRoute = ({
    children,
    ...props
}) => {
    if (localStorage.getItem('jwtToken')) {     
        return <Route exact {...props} >{children}</Route>
    } else {
        return <Redirect to="/login" />
    }
}
export default AuthRoute;
