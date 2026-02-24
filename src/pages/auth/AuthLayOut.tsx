import { Outlet } from "react-router-dom";
import background from "../../assets/images/background.png";
import logo from "../../assets/images/logo.png";

const AuthLayout = () => {
    return (
        <div 
            className="flex h-screen w-full items-center justify-around bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
           
          
                <img src={logo} alt="logo" className="w-[250px] h-[250px] hidden md:block"/>

                <Outlet />
      
    
        </div>
    );
};

export default AuthLayout;