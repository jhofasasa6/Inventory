import React, { Component } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Container
} from 'reactstrap';

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    return (
      <div className="animated fadeIn">        
        <Row>
          <Col xs="12" sm="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-grid"></i>Creacion de Producto
                  <div className="card-header-actions">                    
                    <Button color="link" className="card-header-action btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></Button>                    
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form className="form-horizontal">
                      <Col xs="6">
                        <FormGroup>
                          <Label htmlFor="name">Nmbre Producto</Label>
                          <Input type="text" id="name" placeholder="Enter your name" required />
                        </FormGroup>
                      </Col>
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddProduct;
