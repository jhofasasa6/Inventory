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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table
} from "reactstrap";
import { getItemsPresentations } from "../../actions/presentationAction";
import { getItemsCategories } from "../../actions/categoryAction";
import {
  addItem,
  getItemsProducts,
  updateItem
} from "../../actions/productAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { presentation } from "../../actions/types";
import { categories } from "../../actions/types";
import { products } from "../../actions/types";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      modal: false,
      collapse: true,
      fadeIn: true,
      timeout: 300,
      idPresentation: "",
      idCategory: "",
      nameProduct: "",
      idCodProduct: "",
      error: "",
      edit: false,
      productEditId: ""
    };
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState(prevState => {
      return { fadeIn: !prevState };
    });
  }

  handleChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  onSubmit = e => {
    e.preventDefault();
    let errors = [];

    if (this.state.idPresentation === "0" || this.state.idPresentation === "") {
      errors.push("Debe seleccionar una presentacion");
    }

    if (this.state.idCategory === "0" || this.state.idCategory === "") {
      errors.push("Debe seleccionar una cataegoria");
    }

    if (this.state.nameProduct === "") {
      errors.push("Debe ingresar el nombre del producto");
    }

    if (errors.length > 0) {
      this.state.error = errors.map((error, i) => <p key={i}>{error}</p>);
      this.setState({ modal: !this.state.modal });
      return;
    }

    const newItem = {
      name: this.state.nameProduct,
      presentation: this.props.item.items.find(
        x => x._id === this.state.idPresentation
      ),
      category: this.props.category.items.find(
        x => x._id === this.state.idCategory
      ),
      sku: this.state.idCodProduct
    };
    if (!this.state.edit) {
      this.props.addItem(newItem, products);
    } else {
      this.props.updateItem(this.state.productEditId, newItem, products);
      this.props.getItemsProducts(products);
    }
    this.defaultValues();
  };

  defaultValues() {
    this.setState({ nameProduct: "" });
    this.setState({ idCodProduct: "" });
    this.setState({ idPresentation: "" });
    this.setState({ idCategory: "" });
    this.setState({ productEditId: "" });
    this.setState({ edit: !this.state.edit });
  }

  onEditClick(_id) {
    let product = this.props.product.items.find(x => x._id === _id);
    this.setState({ edit: !this.state.edit });
    this.setState({ nameProduct: product.name });
    this.setState({ idCodProduct: product.sku });
    this.setState({ idPresentation: product.presentation._id });
    this.setState({ idCategory: product.category._id });
    this.setState({ productEditId: product._id });
  }

  render() {
    const presentations = this.props.item.items;
    const categories = this.props.category.items;
    const products = this.props.product.items;
    return (
      <div className="animated fadeIn">
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleModal}>
            Se presentarion los siguientes errores
          </ModalHeader>
          <ModalBody>{this.state.error}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>
              Aceptar
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-social-dropbox" />Creacion de Producto
                  <div className="card-header-actions">
                    <Button
                      color="link"
                      className="card-header-action btn-minimize"
                      data-target="#collapseExample"
                      onClick={this.toggle}
                    >
                      <i className="icon-arrow-up" />
                    </Button>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form className="form-horizontal" onSubmit={this.onSubmit}>
                      <Col md="12">
                        <FormGroup row className="my-0">
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="Product">Producto</Label>
                              <Input
                                type="text"
                                id="Product"
                                name="nameProduct"
                                placeholder="Nombre Producto"
                                onChange={this.handleChange}
                                value={this.state.nameProduct}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="postal-code">Presentación</Label>
                              <Input
                                type="select"
                                name="idPresentation"
                                id="idPresentation"
                                onChange={this.handleChange}
                                value={this.state.idPresentation}
                              >
                                <option default value="0">
                                  Seleccione Presentación
                                </option>
                                {presentations.map(
                                  ({ _id, name, quantity }) => (
                                    <option key={_id} value={_id}>
                                      {name} x {quantity}
                                    </option>
                                  )
                                )}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="postal-code">Categoria</Label>
                              <Input
                                type="select"
                                name="idCategory"
                                id="idCategory"
                                onChange={this.handleChange}
                                value={this.state.idCategory}
                              >
                                <option default value="0">
                                  Seleccione Categoria
                                </option>
                                {categories.map(({ _id, name }) => (
                                  <option key={_id} value={_id}>
                                    {name}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="Product">
                                <strong>Codigo Interno</strong>
                                <small> (SKU)</small>
                              </Label>
                              <Input
                                type="text"
                                id="idCodProduct"
                                name="idCodProduct"
                                placeholder="Codigo Interno"
                                onChange={this.handleChange}
                                value={this.state.idCodProduct}
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <Button
                          type="submit"
                          color="success"
                          style={{
                            display: !this.state.edit ? "block" : "none"
                          }}
                        >
                          Guardar
                        </Button>
                        {"  "}
                        <Button
                          type="submit"
                          color="warning"
                          style={{
                            display: this.state.edit ? "block" : "none"
                          }}
                        >
                          Editar
                        </Button>
                      </Col>
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Prsentación</th>
                      <th>Categoria</th>
                      <th>
                        <strong>Codigo Interno</strong>
                        <small> (SKU)</small>
                      </th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(
                      ({ _id, name, presentation, category, sku }) => (
                        <tr key={_id}>
                          <td>{name}</td>
                          <td id={presentation._id}>
                            {presentation.name} x {presentation.quantity}
                          </td>
                          <td id={category._id}>{category.name}</td>
                          <td>{sku} </td>
                          <td align="center">
                            <Button
                              onClick={this.onEditClick.bind(this, _id)}
                              size="sm"
                              color="primary"
                              tootip="Editar"
                            >
                              <i className="fa fa-edit" />
                            </Button>{" "}
                            <Button
                              //onClick={this.onShowModalClick.bind(this, _id)}
                              size="sm"
                              color="danger"
                              tooltip="Eliminar"
                            >
                              <i className="fa icon-trash" />
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
                <nav>
                  <Pagination>
                    <PaginationItem>
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
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

AddProduct.PropTypes = {
  getItems: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  getItemsProducts: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  item: state.item,
  category: state.category,
  product: state.product
});

export default connect(
  mapStateToProps,
  {
    getItemsPresentations,
    getItemsCategories,
    addItem,
    getItemsProducts,
    updateItem
  }
)(AddProduct);
