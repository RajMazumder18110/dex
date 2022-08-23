import { useContext } from "react";
import { Navbar, NavbarBrand, Nav, Button } from "reactstrap";
import { DEXContext } from "../contexts/dexContext";

const NavBar = () => {
    const { account, walletConnected, handleWalletConnection } = useContext(DEXContext);

    return(
        <Navbar dark>
            <NavbarBrand><h5>DEX</h5></NavbarBrand>
            <Nav className="ms-auto" navbar>
                {walletConnected ?
                    <p className="text-muted d-flex" style={{
                        alignItems: 'center'
                    }}><i class="fa-brands fa-ethereum me-2"></i>{account}</p>
                    :
                    <Button className="px-4 custom-btn"
                        onClick={handleWalletConnection}
                    >Connect</Button>
                }
            </Nav>
        </Navbar>
    )
}

export default NavBar;