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
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  NavLink,
  InputGroup,
  InputGroupAddon,
  InputGroupText
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
moment.locale("es");

const opts = { format: "%s%v", symbol: "$" };
class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalCalculate: false,
      collapseInvoice: true,
      fadeIn: true,
      timeout: 300,
      documentClient: "",
      classModal: "",
      idCodProduct: "",
      nameProduct: "",
      cartShopping: [],
      quantity: 0,
      quantityBuy: 0,
      subTotal: "",
      tax: "",
      total: "",
      payment: "",
      result: 0,

      idPresentation: "",
      idCategory: "",
      headerModal: "",
      message: "",
      buttons: "",
      productSearchResult: [],
      productSelected: "",
      lookInputs: false,
      Inputs: [],
      Outputs: [],
      ActualAmount: 0,
      inputValue: 0,
      dateInput: Date,
      ActualAmount: 0,
      descriptionInput: "",
      nameClient: "",
      emailClient: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleInvoice = this.toggleInvoice.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalCalculate = this.toggleModalCalculate.bind(this);
    this.onBlurIdentification = this.onBlurIdentification.bind(this);
    this.onBlurCodProduct = this.onBlurCodProduct.bind(this);
    this.onClickAddProduct = this.onClickAddProduct.bind(this);
    this.onClickCaculate = this.onClickCaculate.bind(this);
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
  }

  toggleInvoice() {
    this.setState({ collapseInvoice: !this.state.collapseInvoice });
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  toggleModalCalculate() {
    this.setState({ modalCalculate: !this.state.modalCalculate });
  }

  handleChange(e) {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onBlurIdentification() {
    this.setState({ classModal: "modal-danger " + this.props.className });
    this.setState({ headerModal: ".:: Busqueda ::." });
    this.setState({
      message:
        "No existe el cliente con identificación" + this.state.documentClient
    });
    this.setState({
      buttons: (
        <Button color="primary" onClick={this.toggleModal}>
          Aceptar
        </Button>
      )
    });
    this.toggleModal();
    return;
  }

  onBlurCodProduct() {
    if (this.state.idCodProduct !== "") {
      var product = this.props.product.items.filter(
        x => x.sku === this.state.idCodProduct
      );
      this.setState({
        nameProduct: `${product[0].name} ${product[0].presentation.name} x ${
          product[0].presentation.quantity
        }`
      });
    }
  }

  onClickAddProduct() {
    if (this.state.quantity === 0 || this.state.quantity < 0) {
      this.setState({ classModal: "modal-danger " + this.props.className });
      this.setState({ headerModal: ".:: Busqueda ::." });
      this.setState({
        message: "Cantidad de compra invalida" + this.state.documentClient
      });
      this.setState({
        buttons: (
          <Button color="primary" onClick={this.toggleModal}>
            Aceptar
          </Button>
        )
      });
      this.toggleModal();
    } else {
      var cart = this.state.cartShopping;
      var product = this.props.product.items.filter(
        x => x.sku === this.state.idCodProduct
      )[0];

      if (cart.find(x => x.sku === this.state.idCodProduct)) {
        var objIndex = cart.findIndex(
          obj => obj.sku == this.state.idCodProduct
        );
        cart[objIndex].quantity =
          Number(cart[objIndex].quantity) + Number(this.state.quantity);
      } else {
        product.quantity = this.state.quantity;
        cart.push(product);
      }
      this.setState({ cartShopping: cart });
      this.setState({
        quantityBuy: this.state.cartShopping.reduce(
          (prev, next) => prev + Number(next.quantity),
          0
        )
      });
      this.setState({
        subTotal: this.state.cartShopping.reduce(
          (prev, next) =>
            prev +
            Number(next.quantity) *
              Number(next.price.replace(/[^0-9\.-]+/g, "")),
          0
        )
      });
      this.setState({
        tax:
          this.state.cartShopping.reduce(
            (prev, next) =>
              prev +
              Number(next.quantity) *
                Number(next.price.replace(/[^0-9\.-]+/g, "")),
            0
          ) *
          (19 / 100)
      });

      this.setState({
        total: this.state.tax + this.state.subTotal
      });
    }
  }

  onClickCaculate() {
    this.toggleModalCalculate();
  }
  render() {
    const presentations = this.props.item.items;
    const categories = this.props.category.items;
    const products = this.props.product.items;
    const productsFind = this.state.productSearchResult;

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

        <Modal
          size="lg"
          isOpen={this.state.modalCalculate}
          toggle={this.toggleModal}
          className={"modal-primary " + this.props.className}
        >
          <ModalHeader toggle={this.toggleModalCalculate}>
            .:: Calcular ::.
          </ModalHeader>
          <ModalBody>
            <Col md="12" style={{ alignText: "center" }}>
              <tbody>
                <tr>
                  <td>
                    <h4>Total a Pagar: </h4>
                  </td>
                  <td colspan="3" align="right">
                    <Label
                      id="invoiceId"
                      name="invoiceId"
                      onChange={this.handleChange}
                      style={{
                        fontSize: 40,
                        resize: "none",
                        textAlign: "center",
                        color: "#4dbd74",
                        width: "auto"
                      }}
                    >
                      {formatCurrency(
                        this.state.tax + this.state.subTotal,
                        opts
                      )}
                    </Label>
                  </td>
                </tr>
                <tr>
                  <td>
                  <h4>Recibido: </h4>
                  </td>
                  <td colspan="3" align="right">
                    <Input
                      type="text"
                      name="payment"
                      onChange={this.handleChange}
                      value={this.state.payment}                      
                      style={{
                        fontSize: 40,
                        height: 55,
                        textAlign: "center"
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Devolución:</h4>
                  </td>
                  <td colspan="3" align="right">
                    <Label
                      id="invoiceId"
                      name="invoiceId"
                      onChange={this.handleChange}
                      style={{
                        fontSize: 40,
                        resize: "none",
                        textAlign: "right",
                        color: "#f86c6b",
                        width: "auto"
                      }}
                    >
                      {this.state.payment -
                        (this.state.tax + this.state.subTotal) <
                      0
                        ? formatCurrency(0, opts)
                        : formatCurrency(
                            this.state.payment -
                              (this.state.tax + this.state.subTotal),
                            opts
                          )}
                    </Label>
                  </td>
                </tr>
              </tbody>
            </Col>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModalCalculate}>
              Aceptar
            </Button>
          </ModalFooter>
        </Modal>

        <Row>
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa fa-shopping-cart" />Facturación
                  <div className="card-header-actions">
                    <Button
                      color="link"
                      className="card-header-action btn-minimize"
                      data-target="#collapseExample"
                      onClick={this.toggleInvoice}
                    >
                      <i
                        className={
                          this.state.collapseInvoice
                            ? "icon-arrow-up"
                            : "icon-arrow-down"
                        }
                      />
                    </Button>
                  </div>
                </CardHeader>
                <Collapse
                  isOpen={this.state.collapseInvoice}
                  id="collapseExample"
                >
                  <CardBody>
                    <FormGroup row>
                      <Col md="8">
                        <FormGroup row className="my-0">
                          <Col md="3">
                            <div className="controls">
                              <InputGroup className="input-prepend">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i class="fa fa-address-card-o" />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  type="text"
                                  id="documentClient"
                                  name="documentClient"
                                  placeholder="Identificacion Cliente"
                                  onChange={this.handleChange}
                                  value={this.state.documentClient}
                                  onBlur={this.onBlurIdentification}
                                />
                              </InputGroup>
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="controls">
                              <InputGroup className="input-prepend">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i class="fa fa-user" />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  type="text"
                                  id="nameClient"
                                  name="nameClient"
                                  onChange={this.handleChange}
                                  value={this.state.nameClient}
                                  placeholder="Nombre Cliente"
                                  disabled
                                />
                              </InputGroup>
                            </div>
                          </Col>
                          <Col md="3">
                            <div className="controls">
                              <InputGroup className="input-prepend">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i class="fa fa-at" />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  type="text"
                                  id="emailClient"
                                  name="emailClient"
                                  onChange={this.handleChange}
                                  value={this.state.emailClient}
                                  placeholder="correo Cliente"
                                  disabled
                                />
                              </InputGroup>
                            </div>
                          </Col>
                        </FormGroup>
                        <br />
                        <Col md="12">
                          <h4>Valor Venta:</h4>
                        </Col>
                        <Col
                          md="12"
                          className="pull-right"
                          style={{ textAlign: "center" }}
                        >
                          <Label
                            id="invoiceId"
                            name="invoiceId"
                            onChange={this.handleChange}
                            style={{
                              fontSize: 35,
                              resize: "none",
                              textAlign: "center",
                              color: "#f86c6b",
                              width: "auto"
                            }}
                          >
                            {formatCurrency(
                              this.state.tax + this.state.subTotal,
                              opts
                            )}
                          </Label>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="12">
                          <div className="controls">
                            <InputGroup className="input-prepend">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i class="fa fa-calendar-minus-o" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                id="timeStamperInvoice"
                                name="timeStamperInvoice"
                                placeholder={moment().format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                                disabled
                                style={{ textAlign: "center" }}
                              />
                            </InputGroup>
                          </div>
                        </Col>
                        <br />
                        <Col md="12">
                          <h4>Factura N°:</h4>
                        </Col>

                        <Col md="12" style={{ textAlign: "center" }}>
                          <Label
                            id="invoiceId"
                            name="invoiceId"
                            style={{
                              fontSize: 35,
                              textAlign: "center",
                              color: "#4dbd74"
                            }}
                          >
                            123
                          </Label>
                        </Col>
                      </Col>
                    </FormGroup>
                    <Col xs="12" md="12">
                      <CardBody>
                        <Form className="form-horizontal">
                          <FormGroup row>
                            <Col md="8">
                              <FormGroup row className="my-0">
                                <Col md="4">
                                  <div className="controls">
                                    <InputGroup className="input-prepend">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                          <i class="fa fa-barcode" />
                                        </InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        type="text"
                                        id="idCodProduct"
                                        name="idCodProduct"
                                        onChange={this.handleChange}
                                        value={this.state.idCodProduct}
                                        onBlur={this.onBlurCodProduct}
                                        placeholder="Codigo de Producto"
                                        style={{ textAlign: "center" }}
                                      />
                                    </InputGroup>
                                  </div>
                                </Col>
                                <Col md="5">
                                  <InputGroup className="input-prepend">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i class="fa fa-cubes" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="text"
                                      id="nameProduct"
                                      name="nameProduct"
                                      //onChange={this.handleChange}
                                      value={this.state.nameProduct}
                                      placeholder="Nombre del Producto"
                                      style={{ textAlign: "center" }}
                                      disabled
                                    />
                                  </InputGroup>
                                </Col>
                                <Col md="2">
                                  <div className="controls">
                                    <InputGroup className="input-prepend">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                          <i class="fa fa-shopping-bag" />
                                        </InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        onChange={this.handleChange}
                                        value={this.state.quantity}
                                        placeholder="Cantidad"
                                        style={{ textAlign: "center" }}
                                      />
                                    </InputGroup>
                                  </div>
                                </Col>
                                <Col md="1">
                                  <Button
                                    color="success"
                                    onClick={this.onClickAddProduct}
                                  >
                                    <i class="fa fa-cart-plus" />
                                  </Button>
                                </Col>
                              </FormGroup>
                              <hr />
                              <Col md="12">
                                <Table Borderless>
                                  <thead>
                                    <tr>
                                      <th>Cod. Producto</th>
                                      <th>Producto</th>
                                      <th>Catidad</th>
                                      <th>Vlr. Unitario</th>
                                      <th>Vlr. Total</th>
                                      <th />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.cartShopping.map(
                                      ({
                                        _id,
                                        name,
                                        sku,
                                        presentation,
                                        price,
                                        quantity
                                      }) => (
                                        <tr key={_id}>
                                          <td>{sku}</td>
                                          <td>{name}</td>
                                          <td>{quantity}</td>
                                          <th>{price}</th>
                                          <th>
                                            {formatCurrency(
                                              Number(
                                                price.replace(/[^0-9\.-]+/g, "")
                                              ) * quantity,
                                              opts
                                            )}
                                          </th>
                                          <td />
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </Table>
                              </Col>
                            </Col>
                            <Col md="4">
                              <Table Borderless>
                                <tbody>
                                  <tr>
                                    <td>
                                      <h4>Articulos Comprados:</h4>
                                    </td>
                                    <td colspan="3">
                                      <Label
                                        id="invoiceId"
                                        name="invoiceId"
                                        onChange={this.handleChange}
                                        style={{
                                          fontSize: 35,
                                          resize: "none",
                                          textAlign: "center",
                                          color: "#63c2de",
                                          width: "auto"
                                        }}
                                      >
                                        {this.state.quantityBuy}
                                      </Label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <h4>Sub Total:</h4>
                                    </td>
                                    <td colspan="3">
                                      <Label
                                        id="invoiceId"
                                        name="invoiceId"
                                        onChange={this.handleChange}
                                        style={{
                                          fontSize: 35,
                                          resize: "none",
                                          textAlign: "center",
                                          color: "#63c2de",
                                          width: "auto"
                                        }}
                                      >
                                        {formatCurrency(
                                          this.state.subTotal,
                                          opts
                                        )}
                                      </Label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <h4>Total Impuestos:</h4>
                                    </td>
                                    <td colspan="3">
                                      <Label
                                        id="invoiceId"
                                        name="invoiceId"
                                        onChange={this.handleChange}
                                        style={{
                                          fontSize: 35,
                                          resize: "none",
                                          textAlign: "center",
                                          color: "#63c2de",
                                          width: "auto"
                                        }}
                                      >
                                        {formatCurrency(this.state.tax, opts)}
                                      </Label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <h4>Total:</h4>
                                    </td>
                                    <td colspan="3">
                                      <Label
                                        id="invoiceId"
                                        name="invoiceId"
                                        onChange={this.handleChange}
                                        style={{
                                          fontSize: 35,
                                          resize: "none",
                                          textAlign: "center",
                                          color: "#f86c6b",
                                          width: "auto"
                                        }}
                                      >
                                        {formatCurrency(
                                          this.state.tax + this.state.subTotal,
                                          opts
                                        )}
                                      </Label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colspan="4">
                                      <Button
                                        color="primary"
                                        size="lg"
                                        block
                                        onClick={this.onClickCaculate}
                                      >
                                        <i class="fa fa-calculator" />
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colspan="4">
                                      <Button color="success" size="lg" block>
                                        <i class="fa fa-print" />
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Col>
                          </FormGroup>
                        </Form>
                      </CardBody>
                    </Col>
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

Billing.PropTypes = {
  getItems: PropTypes.func.isRequired,
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
)(Billing);
