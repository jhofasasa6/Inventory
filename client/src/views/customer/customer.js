import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Fade,
  FormGroup,
  Input,
  Row,
  Table,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { connect } from "react-redux";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from "../../actions/customerAction";
import PropTypes from "prop-types";
import { customer } from "../../actions/types";
class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      fadeIn: true,
      timeout: 300,
      classModal: "",
      collapse: true,
      documentClient: "",
      name: "",
      lastName: "",
      phone: "",
      address: "",
      headerModal: "",
      message: "",
      buttons: "",
      update: false,
      _id: ""
    };
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClickInsertClient = this.onClickInsertClient.bind(this);
    this.defaultValues = this.defaultValues.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.configModal = this.configModal.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onShowModalClick = this.onShowModalClick.bind(this);
  }

  componentDidMount() {
    this.props.getCustomers(customer);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }
  handleChange(e) {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }
  configModal = (style, title, message, valueButton) => {
    this.setState({ classModal: style + this.props.className });
    this.setState({ headerModal: `.:: ${title} ::.` });
    this.setState({ message: message });
    this.setState({
      buttons: (
        <Button color="primary" onClick={this.toggleModal}>
          {valueButton}
        </Button>
      )
    });
    this.toggleModal();
  };

  onClickInsertClient() {
    let errors = [];

    if (this.state.documentClient === "") {
      errors.push("Debe Ingresar el documento del cliente");
    }

    if (this.state.name === "") {
      errors.push("Debe Ingresar el nombre del cliente");
    }
    if (this.state.lastName === "") {
      errors.push("Debe Ingresar los apellidos del cliente");
    }

    if (errors.length > 0) {
      var message = errors.map((error, i) => <p key={i}>{error}</p>);
      this.configModal(
        "modal-danger ",
        "Se presentaron los siguientes errores",
        message,
        "Aceptar"
      );

      return;
    }

    let newCustomer = {
      identification: this.state.documentClient,
      names: this.state.name,
      lastNames: this.state.lastName,
      phone: this.state.phone,
      address: this.state.address
    };
    if (!this.state.update) {
      this.props.addCustomer(newCustomer, customer);
    } else {
      this.props.updateCustomer(this.state._id, newCustomer, customer);
      this.props.getCustomers(customer);
    }

    this.defaultValues()
  }
  defaultValues() {
    this.setState({ documentClient: "" });
    this.setState({ name: "" });
    this.setState({ lastName: "" });
    this.setState({ phone: "" });
    this.setState({ address: "" });
    this.setState({ update: false });
  }
  onShowModalClick(_id) {
    this.setState({ modal: !this.state.modal });
    this.setState({ _id: _id });
  }
  onEditClick(_id) {
    const customers = this.props.customers;
    var customer = customers.find(item => item._id === _id);
    this.setState({ update: true });
    this.setState({ _id: _id });
    this.setState({ documentClient: customer.identification });
    this.setState({ name: customer.names });
    this.setState({ lastName: customer.lastNames });
    this.setState({ phone: customer.phone });
    this.setState({ address: customer.address });
  }
  render() {
    const customers = this.props.customers;
    let button;
    let buttonCancel;
    if (this.state.update) {
      button = (
        <Button onClick={this.onClickInsertClient} size="sm" color="success">
          Editar
        </Button>
      );
      buttonCancel = (
        <Button onClick={this.defaultValues} size="sm" color="warning">
          Cancelar
        </Button>
      );
    } else {
      button = (
        <Button onClick={this.onClickInsertClient} size="sm" color="success">
          Guardar
        </Button>
      );
      buttonCancel = "";
    }
    return (
      <div className="animated fadeIn">
        <Modal
          size="lg"
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.state.classModal}
        >
          <ModalHeader toggle={this.toggleModal}>
            {this.state.headerModal}
          </ModalHeader>
          <ModalBody>{this.state.message}</ModalBody>
          <ModalFooter>{this.state.buttons}</ModalFooter>
        </Modal>
        <Row>
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa fa-user-plus" />Creación de Clientes
                  <div className="card-header-actions">
                    <Button
                      color="link"
                      className="card-header-action btn-minimize"
                      data-target="#collapseExample"
                      onClick={this.toggle}
                    >
                      <i
                        className={
                          this.state.collapse
                            ? "icon-arrow-up"
                            : "icon-arrow-down"
                        }
                      />
                    </Button>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <FormGroup row>
                      <Col md="4">
                        <Col md="8">
                          <div className="controls">
                            <InputGroup className="input-prepend">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="fa fa-address-card-o" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                id="documentClient"
                                name="documentClient"
                                placeholder="Identificacion Cliente"
                                onChange={this.handleChange}
                                value={this.state.documentClient}
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <br />
                        <Col md="12">
                          <div className="controls">
                            <InputGroup className="input-prepend">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="fa fa-user" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                id="name"
                                name="name"
                                onChange={this.handleChange}
                                value={this.state.name}
                                placeholder="Nombres"
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <br />
                        <Col md="12">
                          <div className="controls">
                            <InputGroup className="input-prepend">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="fa fa-user" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                onChange={this.handleChange}
                                value={this.state.lastName}
                                placeholder="Apellidos"
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <br />
                        <Col md="12">
                          <div className="controls">
                            <InputGroup className="input-prepend">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="fa fa-phone" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                id="phone"
                                name="phone"
                                onChange={this.handleChange}
                                value={this.state.phone}
                                placeholder="Telefonos"
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <br />
                        <Col md="12">
                          <div className="controls">
                            <InputGroup className="input-prepend">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="fa fa-map-marker" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                id="address"
                                name="address"
                                onChange={this.handleChange}
                                value={this.state.address}
                                placeholder="Dirección"
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <br />
                        <Col md="12">
                          {button} {buttonCancel}
                        </Col>
                      </Col>
                      <Col md="8">
                        <Table striped>
                          <thead>
                            <tr>
                              <th>Identificación</th>
                              <th>Nombres</th>
                              <th>Apellidos</th>
                              <th>Telefonos</th>
                              <th>Dirección</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {customers.map(
                              ({
                                _id,
                                identification,
                                names,
                                lastNames,
                                address,
                                phone
                              }) => (
                                <tr key={_id}>
                                  <td>{identification}</td>
                                  <td>{names}</td>
                                  <td>{lastNames}</td>
                                  <td>{phone}</td>
                                  <td>{address}</td>
                                  <td>
                                    <Button
                                      onClick={this.onEditClick.bind(this, _id)}
                                      size="sm"
                                      color="primary"
                                      tootip="Editar"
                                    >
                                      <i className="fa fa-edit" />
                                    </Button>{" "}
                                    {/* <Button
                                      onClick={this.onShowModalClick.bind(
                                        this,
                                        _id
                                      )}
                                      size="sm"
                                      color="danger"
                                      tooltip="Eliminar"
                                    >
                                      <i className="fa icon-trash" />
                                    </Button> */}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                        <Pagination>
                          <PaginationItem disabled>
                            <PaginationLink previous tag="button">
                              Prev
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink tag="button">2</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink tag="button">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink tag="button">4</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink next tag="button">
                              Next
                            </PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      </Col>
                    </FormGroup>
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

Customer.propTypes = {
  getCustomers: PropTypes.func.isRequired,
  addCustomer: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired,
  deleteCustomer: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  customers: state.customer.customers
});

export default connect(
  mapStateToProps,
  {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
)(Customer);
