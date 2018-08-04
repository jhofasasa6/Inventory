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
class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      collapseFilter: true,
      collapseResult: true,
      collapseInputs: false,
      fadeIn: true,
      timeout: 300,
      nameProduct: "",
      idPresentation: "",
      idCategory: "",
      idCodProduct: "",
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
      classModal: "",
      documentClient: "",
      nameClient: "",
      emailClient: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleResult = this.toggleResult.bind(this);
    this.toggleInputs = this.toggleInputs.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.onInsertClick = this.onInsertClick.bind(this);
    this.onClearFiltersSelected = this.onClearFiltersSelected.bind(this);
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
  }

  toggleFilters() {
    this.setState({ collapseFilter: !this.state.collapseFilter });
  }

  toggleResult() {
    this.setState({ collapseResult: !this.state.collapseResult });
  }

  toggleInputs() {
    this.setState({ collapseInputs: !this.state.collapseInputs });
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  handleChange(e) {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSelectProduct(_id) {
    this.setState({
      productSearchResult: this.state.productSearchResult.filter(
        x => x._id === _id
      )
    });

    this.setState({
      productSelected: (
        <small>
          {this.state.productSearchResult.filter(x => x._id === _id)[0].name}
          {"    "}
          {
            this.state.productSearchResult.filter(x => x._id === _id)[0]
              .presentation.name
          }{" "}
          x{" "}
          {
            this.state.productSearchResult.filter(x => x._id === _id)[0]
              .presentation.quantity
          }
          {"   "}
          ({this.state.productSearchResult.filter(x => x._id === _id)[0].sku})
        </small>
      )
    });

    this.setState({ lookInputs: true });

    this.setState({ collapseInputs: true });

    this.setState({
      Inputs: this.state.productSearchResult.filter(x => x._id === _id)[0]
        .Inputs
    });

    this.setState({
      Outpus: this.state.productSearchResult.filter(x => x._id === _id)[0]
        .Outpus
    });

    this.setState({
      ActualAmount: this.state.productSearchResult.filter(x => x._id === _id)[0]
        .ActualAmount
    });

    this.toggleFilters();
    this.toggleResult();
  }

  onClearFilters() {
    this.setState({ nameProduct: "" });
    this.setState({ idPresentation: "" });
    this.setState({ idCategory: "" });
    this.setState({ idCodProduct: "" });
    this.setState({ productSearchResult: [] });
    this.setState({ lookInputs: false });
    this.setState({ collapseInputs: false });
  }

  onClearFiltersSelected() {
    this.setState({ dateInput: "" });
    this.setState({ inputValue: 0 });
    this.setState({ descriptionInput: "" });
  }

  onSearchClick(e) {
    e.preventDefault();

    if (
      this.state.nameProduct === "" &&
      this.state.idPresentation === "" &&
      this.state.idCategory === "" &&
      this.state.idCodProduct === ""
    ) {
      this.setState({ headerModal: ".:: Busqueda ::." });
      this.setState({
        message: "ingrese algunos de los filtros para la busqueda"
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
    var productSearch = this.props.product.items;
    if (this.state.nameProduct)
      productSearch = productSearch.filter(
        x => x.name === this.state.nameProduct
      );
    if (this.state.idPresentation)
      productSearch = productSearch.filter(
        x => x.presentation._id === this.state.idPresentation
      );
    if (this.state.idCategory)
      productSearch = productSearch.filter(
        x => x.category._id === this.state.idCategory
      );
    if (this.state.idCodProduct)
      productSearch = productSearch.filter(
        x => x.sku === this.state.idCodProduct
      );

    this.setState({ productSearchResult: productSearch });

    if (productSearch.length === 0) {
      this.setState({ headerModal: ".:: Busqueda ::." });
      this.setState({
        message: "No se encontraron articulos con los filtros ingresados"
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
      if (!this.state.collapseResult) {
        this.toggleResult();
        this.setState({ productsFind: [] });
        this.setState({ productSelected: "" });
      }
    }
  }

  onInsertClick() {
    let errors = [];

    if (this.state.inputValue === 0 || this.state.idPresentation < 0) {
      errors.push("Debe Ingresar una cantidad valida");
    }

    if (this.state.descriptionInput === "") {
      errors.push("Debe Ingresar una descripcion del ingreso");
    }

    if (errors.length > 0) {
      this.setState({ classModal: "modal-danger " + this.props.className });
      this.state.message = errors.map((error, i) => <p key={i}>{error}</p>);
      this.setState({ modal: !this.state.modal });
      this.setState({
        headerModal: ".:: Se presentarion los siguientes errores ::."
      });
      this.setState({
        buttons: (
          <Button color="primary" onClick={this.toggleModal}>
            Aceptar
          </Button>
        )
      });
      return;
    }

    var inputs = 0;
    var outputs = 0;
    if (this.state.Outputs.length > 0) {
      outputs = this.state.Outputs.reduce(
        (prev, next) => prev + next.Output,
        0
      );
    }
    if (this.state.Inputs.length > 0) {
      inputs = this.state.Inputs.reduce((prev, next) => prev + next.Input, 0);
    }

    var actual =
      Number(inputs) - Number(outputs) + Number(this.state.inputValue);

    this.setState({ ActualAmount: actual });

    let inputProduct = {
      ActualAmount: actual,
      Input: {
        _id: uuid(),
        CreationDate: Date.now(),
        DescriptionInput: this.state.descriptionInput,
        Input: this.state.inputValue,
        ActualAmount: actual
      }
    };

    var product = this.state.productSearchResult[0];
    product.ActualAmount = inputProduct.ActualAmount;
    product.Inputs.push(inputProduct.Input);
    this.props.updateItem(product._id, product, products);
    this.props.getItemsProducts(products);
    this.setState({ ActualAmount: actual });
  }
  render() {
    const presentations = this.props.item.items;
    const categories = this.props.category.items;
    const products = this.props.product.items;
    const productsFind = this.state.productSearchResult;
    const opts = { format: "%s%v", symbol: "$" };
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
                  <i className="fa fa-shopping-cart" />Facturación
                  <div className="card-header-actions">
                    <Button
                      color="link"
                      className="card-header-action btn-minimize"
                      data-target="#collapseExample"
                      onClick={this.toggleFilters}
                    >
                      <i
                        className={
                          this.state.collapseFilter
                            ? "icon-arrow-up"
                            : "icon-arrow-down"
                        }
                      />
                    </Button>
                  </div>
                </CardHeader>
                <Collapse
                  isOpen={this.state.collapseFilter}
                  id="collapseExample"
                >
                  <CardBody>
                    <Form action="" method="post" className="form-horizontal">
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
                                    value={this.state.nameProduct}
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
                                    value={this.state.nameProduct}
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
                                    value={this.state.nameProduct}
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
                          <Col md="12" className="pull-right" style={{textAlign: 'center'}}>
                            <Label
                              id="invoiceId"
                              name="invoiceId"
                              onChange={this.handleChange}
                              style={{
                                fontSize: 40,
                                resize: "none",
                                textAlign: "center",
                                color: "#63c2de",
                                width: "auto"
                              }}
                            >
                              {formatCurrency("1259450", opts)}
                            </Label>
                            <hr />
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
                                  id="nameClient"
                                  name="nameClient"
                                  onChange={this.handleChange}
                                  value={this.state.nameProduct}
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

                          <Col md="12" style={{textAlign: 'center'}}>
                            <Label
                              id="invoiceId"
                              name="invoiceId"
                              multiline={true}
                              style={{
                                fontSize: 40,
                                textAlign: "center",
                                color: "#f86c6b"
                              }}
                            >
                              123
                            </Label>
                            <hr />
                          </Col>
                        </Col>
                      </FormGroup>
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
