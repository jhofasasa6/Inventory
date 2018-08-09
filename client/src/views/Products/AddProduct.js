import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Fade,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Tooltip,
  UncontrolledTooltip
} from "reactstrap";
import { getItemsPresentations } from "../../actions/presentationAction";
import { getItemsCategories } from "../../actions/categoryAction";
import {
  addItem,
  getItemsProducts,
  updateItem,
  deleteItem
} from "../../actions/productAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { presentation } from "../../actions/types";
import { categories } from "../../actions/types";
import { products } from "../../actions/types";
import uuid from "uuid";
import moment from "moment";
import formatCurrency from "format-currency";
import { AppSwitch } from "@coreui/react";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      tooltipOpen: [false, false],
      modal: false,
      collapse: true,
      fadeIn: true,
      timeout: 300,
      idPresentation: "",
      idCategory: "",
      nameProduct: "",
      idCodProduct: "",
      message: "",
      edit: false,
      productEditId: "",
      headerModal: "",
      status: "primary",
      deleteId: "",
      price: "",
      classModal: "",
      lookDelete: "none"
    };

    this.deleteProduct = this.deleteProduct.bind(this);
    this.handleonBlur = this.handleonBlur.bind(this);
    this.onlookDelete = this.onlookDelete.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.defaultValues = this.defaultValues.bind(this);
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

  handleonBlur() {
    var price = formatCurrency(this.state.price);
    this.setState({ price: price });
  }

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
      this.state.message = errors.map((error, i) => <p key={i}>{error}</p>);
      this.setState({ modal: !this.state.modal });
      this.setState({
        headerModal: ".:: Se presentarion los siguientes errores ::."
      });
      return;
    }

    const newItem = {
      name: this.state.nameProduct,
      price: this.state.price,
      presentation: this.props.item.items.find(
        x => x._id === this.state.idPresentation
      ),
      category: this.props.category.items.find(
        x => x._id === this.state.idCategory
      ),
      sku: this.state.idCodProduct,
      ActualAmount: 0,
      Inputs: {}
    };
    if (!this.state.edit) {
      newItem.Inputs = [
        {
          _id: uuid(),
          DescriptionInput: "Creación de Producto",
          Input: 0,
          CreationDate: Date.now(),
          ActualAmount: 0,
          Index: 0
        }
      ];
      this.props.addItem(newItem, products);
    } else {
      newItem.Inputs = this.props.product.items.find(
        x => x._id === this.state.productEditId
      ).Inputs;
      newItem.ActualAmount = this.props.product.items.find(
        x => x._id === this.state.productEditId
      ).ActualAmount;
      newItem.enable = true;
      this.props.updateItem(this.state.productEditId, newItem, products);
      this.props.getItemsProducts(products);
      this.setState({ edit: !this.state.edit });
    }
    this.defaultValues();
  };

  defaultValues() {
    this.setState({ nameProduct: "" });
    this.setState({ idCodProduct: "" });
    this.setState({ idPresentation: "" });
    this.setState({ idCategory: "" });
    this.setState({ productEditId: "" });
    this.setState({ price: "" });
    this.setState({ edit: false });
  }

  onEditClick(_id) {
    let product = this.props.product.items.find(x => x._id === _id);
    this.setState({ edit: !this.state.edit });
    this.setState({ nameProduct: product.name });
    this.setState({ idCodProduct: product.sku });
    this.setState({ idPresentation: product.presentation._id });
    this.setState({ idCategory: product.category._id });
    this.setState({ productEditId: product._id });
    this.setState({ price: formatCurrency(product.price) });
  }

  onDeleteClick(_id) {
    this.setState({ classModal: "modal-danger " + this.props.className });
    this.setState({ modal: !this.state.modal });
    this.setState({ headerModal: ".:: ? ::." });
    this.setState({ status: "danger" });
    this.setState({ deleteId: _id });
    this.state.message = <p>Desea eliminar este producto?</p>;
  }

  deleteProduct() {
    var product = this.props.product.items.find(
      x => x._id === this.state.deleteId
    );
    product.enable = false;
    this.props.updateItem(this.state.deleteId, product, products);
    this.props.getItemsProducts(products);
    this.setState({ modal: !this.state.modal });
    /* this.props.deleteItem(this.state.deleteId, products);
     */
  }

  onlookDelete() {
    if (document.getElementById("lookDelete").checked) {
      this.setState({ lookDelete: "" });
    } else {
      this.setState({ lookDelete: "none" });
    }
  }

  toggleTooltip(i) {
    const newArray = this.state.tooltipOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      tooltipOpen: newArray
    });
  }

  render() {
    const presentations = this.props.item.items;
    const categories = this.props.category.items;
    const products = this.props.product.items;
    const opts = { format: "%s%v", symbol: "$" };

    return (
      <div className="animated fadeIn">
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.state.classModal}
        >
          <ModalHeader toggle={this.toggleModal}>
            {this.state.headerModal}
          </ModalHeader>
          <ModalBody>{this.state.message}</ModalBody>
          <ModalFooter>
            <Button color={this.state.status} onClick={this.deleteProduct}>
              Aceptar
            </Button>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancelar
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
                    <Form className="form-horizontal" onSubmit={this.onSubmit}>
                      <Col md="12">
                        <FormGroup row className="my-0">
                          <Col xs="4">
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
                          <Col xs="2">
                            <FormGroup>
                              <Label htmlFor="Product">
                                <strong>Codigo Interno</strong>
                                <small> (SKU)</small>
                              </Label>
                              <div className="controls">
                                <InputGroup className="input-prepend">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="fa fa-barcode" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="text"
                                    id="idCodProduct"
                                    name="idCodProduct"
                                    placeholder="Codigo Interno"
                                    onChange={this.handleChange}
                                    value={this.state.idCodProduct}
                                  />
                                </InputGroup>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col xs="2">
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
                          <Col xs="2">
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

                          <Col xs="2">
                            <FormGroup>
                              <Label htmlFor="Product">Precio</Label>
                              <div className="controls">
                                <InputGroup className="input-prepend">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>$</InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="text"
                                    id="price"
                                    name="price"
                                    placeholder="Precio Producto"
                                    onChange={this.handleChange}
                                    onBlur={this.handleonBlur}
                                    value={this.state.price}
                                  />
                                </InputGroup>
                              </div>
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
                            display: this.state.edit ? "" : "none"
                          }}
                        >
                          Editar
                        </Button>
                        {"  "}
                        <Button
                          onClick={this.defaultValues}
                          color="danger"
                          style={{
                            display: this.state.edit ? "" : "none"
                          }}
                        >
                          Cancelar
                        </Button>
                      </Col>
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>
        <Row
          style={{
            display: products.length > 0 ? "block" : "none"
          }}
        >
          <Col>
            <Card>
              <CardBody>
                <a href="#" id="TooltipExample">
                  <AppSwitch
                    className={"mx-1"}
                    // variant={"pill"}
                    color={"danger"}
                    id="lookDelete"
                    onChange={this.onlookDelete}
                  />
                </a>

                <Tooltip
                  placement="top"
                  isOpen={this.state.tooltipOpen[0]}
                  target="TooltipExample"
                  toggle={() => {
                    this.toggleTooltip(0);
                  }}
                >
                  Ver Productos Eliminados
                </Tooltip>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Prsentación</th>
                      <th>Categoria</th>
                      <th>
                        <strong>Codigo Interno</strong>
                        <small> (SKU)</small>
                      </th>
                      <th>Precio ($)</th>
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(
                      ({
                        _id,
                        name,
                        presentation,
                        category,
                        sku,
                        price,
                        enable
                      }) => (
                        <tr
                          key={_id}
                          style={
                            !enable
                              ? {
                                  display: this.state.lookDelete,
                                  backgroundColor: "#f86c6b"
                                }
                              : { display: "" }
                          }
                        >
                          <td>{!enable ? <del>{name}</del> : name}</td>
                          <td id={presentation._id}>
                            {!enable ? (
                              <del>{presentation.name}</del>
                            ) : (
                              presentation.name
                            )}{" "}
                            x{" "}
                            {!enable ? (
                              <del>{presentation.quantity}</del>
                            ) : (
                              presentation.quantity
                            )}
                          </td>
                          <td id={category._id}>
                            {!enable ? (
                              <del>{category.name}</del>
                            ) : (
                              category.name
                            )}
                          </td>
                          <td>{!enable ? <del>{sku}</del> : sku} </td>
                          <td>
                            {!enable ? (
                              <del>{formatCurrency(price, opts)}</del>
                            ) : (
                              formatCurrency(price, opts)
                            )}{" "}
                          </td>
                          <td align="center">
                            <Button
                              onClick={this.onEditClick.bind(this, _id)}
                              size="sm"
                              color="primary"
                              id="editProduct"
                              disabled={!enable}
                            >
                              <i className="fa fa-edit" />
                            </Button>
                            <Tooltip
                              placement="top"
                              isOpen={this.state.tooltipOpen[0]}
                              target="editProduct"
                              toggle={() => {
                                this.toggleTooltip(0);
                              }}
                            >
                              Editar Producto
                            </Tooltip>{" "}
                            <Button
                              onClick={this.onDeleteClick.bind(this, _id)}
                              size="sm"
                              color="danger"
                              tooltip="Eliminar"
                              disabled={!enable}
                            >
                              <i className="fa icon-trash" />
                            </Button>
                            {"  "}
                            <Button
                              //onClick={this.onDeleteClick.bind(this, _id)}
                              size="sm"
                              color="primary"
                              tooltip="Ver Entradas"
                              disabled={!enable}
                            >
                              <i className="fa icon-login" />
                            </Button>
                          </td>
                          <td>
                            {!enable ? <i className="fa fa-lock fa-lg" /> : ""}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

AddProduct.propTypes = {
  addItem: PropTypes.func.isRequired,
  getItemsProducts: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
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
    updateItem,
    deleteItem
  }
)(AddProduct);
