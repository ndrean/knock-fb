import React from "react";
import LoginForm from "./LoginForm";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

export default function MyNavBar() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">goDW</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">
            <LoginForm />
          </Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-light" type="submit">
            Search
          </Button>
        </Form>
      </Navbar>
    </>
  );
}
