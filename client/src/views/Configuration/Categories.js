import React, { Component } from "react";
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
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { connect } from "react-redux";
import {
  getItemsCategories,
  addItem,
  deleteItem,
  updateItem
} from "../../actions/categoryAction";
import PropTypes from "prop-types";
import { categories } from "../../actions/types";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      name: "",
      description: "",
      update: false,
      modal: false,
      _id: ""
    };
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
  }

  componentDidMount() {
    this.props.getItemsCategories(categories);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.setState({ modal: !this.state.modal });
  }

  toggleFade() {
    this.setState(prevState => {
      return { fadeIn: !prevState };
    });
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newItem = {
      name: this.state.name,
      description: this.state.description
    };

    if (!this.state.update) {
      this.props.addItem(newItem, categories);
    } else {
      this.props.updateItem(this.state._id, newItem, categories);
      this.props.getItemsCategories(categories);
      this.onCancelClick();
    }

    this.setState({ name: "" });
    this.setState({ description: "" });
  };

  onEditClick(_id) {
    const { items } = this.props.item;
    var item = items.filter(item => item._id === _id);
    this.setState({ update: true });
    this.setState({ name: item[0].name });
    this.setState({ description: item[0].description });
    this.setState({ _id: _id });
  }

  onCancelClick() {
    this.setState({ update: false });
    this.setState({ name: "" });
    this.setState({ description: "" });
  }

  onDeleteClick() {
    this.setState({ modal: !this.state.modal });
    this.props.deleteItem(this.state._id, categories);
  }

  onShowModalClick(_id) {
    this.setState({ modal: !this.state.modal });
    this.setState({ _id: _id });
  }

  render() {
    const { items } = this.props.item;
    let button;
    let buttonCancel;
    if (this.state.update) {
      button = (
        <Button type="submit" size="sm" color="success">
          Editar
        </Button>
      );
      buttonCancel = (
        <Button onClick={this.onCancelClick} size="sm" color="warning">
          Cancelar
        </Button>
      );
    } else {
      button = (
        <Button type="submit" size="sm" color="success">
          Guardar
        </Button>
      );
      buttonCancel = "";
    }

    return (
      <div className="animated fadeIn">
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>?</ModalHeader>
          <ModalBody>Desea eliminar el registro?</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onDeleteClick}>
              Aceptar
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Row>
          <Col xs="12" sm="4">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-settings" />
                  <strong>Categorias</strong>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form className="was-validated" onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label htmlFor="name">
                          <strong>Tipo Categoria</strong>
                        </Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          required
                          onChange={this.onChange}
                          className="form-control-warning"
                          value={this.state.name}
                        />
                        <FormFeedback className="help-block">
                          Ingrese un tipo de Categoria
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="name">
                          <strong>Descripción de la Categoria</strong>
                        </Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          onChange={this.onChange}
                          className="form-control-warning"
                          value={this.state.description}
                        />
                      </FormGroup>
                      {button} {buttonCancel}
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
          <Col xs="12" sm="8">
            <Card>
              <CardHeader>
                <i className="fa icon-tag" />
                <strong>Tabla Categorias</strong>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Descripción</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  {items.map(({ _id, name, description }) => (
                    <tbody key={_id}>
                      <tr>
                        <td>{name}</td>
                        <td>{description}</td>
                        <td>
                          <Button
                            onClick={this.onEditClick.bind(this, _id)}
                            size="sm"
                            color="primary"
                            tootip="Editar"
                          >
                            <i className="fa fa-edit" />
                          </Button>{" "}
                          <Button
                            onClick={this.onShowModalClick.bind(this, _id)}
                            size="sm"
                            color="danger"
                            tooltip="Eliminar"
                          >
                            <i className="fa icon-trash" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Categories.PropTypes = {
  getItemsCategories: PropTypes.func.isRequired,
  addItems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  item: state.category
});

export default connect(
  mapStateToProps,
  { getItemsCategories, addItem, deleteItem, updateItem }
)(Categories);
