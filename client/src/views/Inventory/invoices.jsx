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
  Tooltip
} from "reactstrap";
import { getItemsPresentations } from "../../actions/presentationAction";
import { getItemsCategories } from "../../actions/categoryAction";
import {
  addItem,
  getItemsProducts,
  updateItem,
  deleteItem
} from "../../actions/productAction";
import { getInvoices } from "../../actions/invoicesAction";
import { getCustomers } from "../../actions/customerAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { presentation } from "../../actions/types";
import { categories } from "../../actions/types";
import { products } from "../../actions/types";
import { invoices } from "../../actions/types";
import { customer } from "../../actions/types";
import uuid from "uuid";
import moment from "moment";
import { AppSwitch } from "@coreui/react";
import formatCurrency from "format-currency";
import html from "react-inner-html";
moment.locale("es");
const opts = { format: "%s%v", symbol: "$" };
class InputProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: [false, false],
      modal: false,
      collapseFilter: true,
      collapseResult: true,
      collapseInvoicesResult: false,
      fadeIn: true,
      timeout: 300,
      invoiceNumber: "",
      idClient: "",
      idCategory: "",
      fromDate: "",
      toDate: "",
      headerModal: "",
      message: "",
      buttons: "",
      invoiceSearchResult: [],
      productSelected: "",
      lookInvoices: false,
      Inputs: [],
      Outputs: [],
      ActualAmount: 0,
      inputValue: 0,
      dateInput: Date,
      ActualAmount: 0,
      descriptionInput: "",
      classModal: "",
      enable: false,
      error: "",
      mix: [],
      lookOutputs: "none"
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
    this.mix = this.mix.bind(this);
    this.onlookOutputs = this.onlookOutputs.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.onClickFindProducts = this.onClickFindProducts.bind(this);
    this.onClickIdClient = this.onClickIdClient.bind(this);
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
    this.props.getInvoices(invoices);
    this.props.getCustomers(customer);
  }

  toggleTooltip(i) {
    const newArray = this.state.tooltipOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      tooltipOpen: newArray
    });
  }

  onlookOutputs() {
    if (document.getElementById("lookOutputs").checked) {
      this.setState({ lookOutputs: "" });
    } else {
      this.setState({ lookOutputs: "none" });
    }
  }

  toggleFilters() {
    this.setState({ collapseFilter: !this.state.collapseFilter });
  }

  toggleResult() {
    this.setState({ collapseResult: !this.state.collapseResult });
  }

  toggleInputs() {
    this.setState({
      collapseInvoicesResult: !this.state.collapseInvoicesResult
    });
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  handleChange(e) {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSearchClick(e) {
    e.preventDefault();
    if (
      this.state.invoiceNumber === "" &&
      this.state.idClient === "" &&
      this.state.fromDate === "" &&
      this.state.toDate === ""
    ) {
      this.configModal(
        "modal-danger ",
        "Busqueda",
        "ingrese algunos de los filtros para la busqueda",
        "Aceptar"
      );
      return;
    }

    let invoiceSearch = this.props.invoice.items;
    if (this.state.invoiceNumber)
      invoiceSearch = invoiceSearch.filter(
        x => x.invoiceNumber === this.state.invoiceNumber
      );
    if (this.state.idClient)
      invoiceSearch = invoiceSearch.filter(
        x => x.idClient === this.state.idClient
      );
    if (this.state.fromDate) {
      invoiceSearch = invoiceSearch.filter(x => x.date >= this.state.fromDate);
    }
    if (this.state.toDate) {
      invoiceSearch = invoiceSearch.filter(x => x.date <= this.state.toDate);
    }

    this.setState({ invoiceSearchResult: invoiceSearch });

    if (invoiceSearch.length === 0) {
      this.configModal(
        "modal-danger ",
        "Busqueda",
        "No se encontraron facturas con los filtros ingresados",
        "Aceptar"
      );
      return;
    }
    this.setState({ lookInvoices: true });
    this.setState({ collapseInvoicesResult: true });
    this.setState({ collapseFilter: false });
  }

  onClickFindProducts(_id) {
    var invoiceSearch = this.props.invoice.items.find(x => x._id === _id);
    var rows = "";
    var headTable = `<Table style="text-align: center;width: 100%;  ">
                    <thead>
                        <tr style="border-bottom: 1px solid #ccc">
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>`;
    invoiceSearch.products.forEach(element => {
      rows =
        rows +
        `      <tr>
                    <td scope="row">${
                      this.props.product.items.find(
                        x => x._id === element.idProduct
                      ).name
                    } ${
          this.props.product.items.find(x => x._id === element.idProduct)
            .presentation.name
        } x ${
          this.props.product.items.find(x => x._id === element.idProduct)
            .presentation.quantity
        }

                    </td>
                    <td scope="row">${formatCurrency(element.price, opts)}</td>
                    <td scope="row">${element.quantity}</td>
                    </tr>`;
    });
    var endTable = `</tbody></Table>`;
    var table = headTable + rows + endTable;
    this.configModal("modal-primary ", "Productos", table, "Aceptar");
  }

  onClickIdClient(idClient) {
    this.configModal(
      "modal-primary ",
      "Información del cliente",
      `<Table style="text-align: center;width: 100%;  ">
            <thead>
                <tr style="border-bottom: 1px solid #ccc">
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Dirección</th>
                    <th>Telefono</th>
                </tr>
            </thead>
            <tbody>  
                <tr>      
                    <td scope="row">${
                      this.props.customers.find(
                        x => x.identification === idClient
                      ).names
                    }</td>
                    <td scope="row">${
                      this.props.customers.find(
                        x => x.identification === idClient
                      ).lastNames
                    }</td>
                    <td scope="row">${
                      this.props.customers.find(
                        x => x.identification === idClient
                      ).address
                    }</td>
                    <td scope="row">${
                      this.props.customers.find(
                        x => x.identification === idClient
                      ).phone
                    }</td>
                </tr>
            </tbody>
        </Table>`,
      "Aceptar"
    );
  }

  onSelectProduct(_id) {
    if (!this.state.invoiceSearchResult.filter(x => x._id === _id)[0].enable) {
      this.setState({ enable: true });
      this.setState({ error: "Producto no disponible" });
    } else {
      this.setState({ enable: false });
      this.setState({ error: "" });
    }

    this.setState({
      invoiceSearchResult: this.state.invoiceSearchResult.filter(
        x => x._id === _id
      )
    });

    this.setState({
      productSelected: (
        <small>
          {this.state.invoiceSearchResult.filter(x => x._id === _id)[0].name}
          {"    "}
          {
            this.state.invoiceSearchResult.filter(x => x._id === _id)[0]
              .presentation.name
          }{" "}
          x{" "}
          {
            this.state.invoiceSearchResult.filter(x => x._id === _id)[0]
              .presentation.quantity
          }
          {"   "}
          ({this.state.invoiceSearchResult.filter(x => x._id === _id)[0].sku})
        </small>
      )
    });

    this.setState({ lookInvoices: true });

    this.setState({ collapseInvoicesResult: true });

    this.setState({
      Inputs: this.state.invoiceSearchResult.filter(x => x._id === _id)[0]
        .Inputs
    });

    this.setState({
      Outputs: this.state.invoiceSearchResult.filter(x => x._id === _id)[0]
        .Outputs
    });

    this.mix();

    this.setState({
      ActualAmount: this.state.invoiceSearchResult.filter(x => x._id === _id)[0]
        .ActualAmount
    });

    this.toggleFilters();
    this.toggleResult();
  }

  mix() {
    let mixtures = [];
    this.state.invoiceSearchResult[0].Inputs.map(
      ({ _id, DescriptionInput, Input, CreationDate, ActualAmount, Index }) =>
        mixtures.push({
          _id: _id,
          date: CreationDate,
          description: DescriptionInput,
          quantity: Input,
          actualAmount: ActualAmount,
          index: Index,
          type: "I" //Input
        })
    );

    this.state.invoiceSearchResult[0].Outputs.map(
      ({ _id, DescriptionOutput, Output, CreationDate, ActualAmount, Index }) =>
        mixtures.push({
          _id: _id,
          date: CreationDate,
          description: DescriptionOutput,
          quantity: Output,
          actualAmount: ActualAmount,
          index: Index,
          type: "O" //Output
        })
    );

    mixtures.sort(function(a, b) {
      if (a.index > b.index) {
        return 1;
      }
      if (a.index < b.index) {
        return -1;
      }
      return 0;
    });
    this.setState({ mix: mixtures });
  }

  onClearFilters() {
    this.setState({ invoiceNumber: "" });
    this.setState({ idClient: "" });
    this.setState({ idCategory: "" });
    this.setState({ fromDate: "" });
    this.setState({ toDate: "" });
    this.setState({ invoiceSearchResult: [] });
    this.setState({ lookInvoices: false });
    this.setState({ collapseInvoicesResult: false });
  }

  onClearFiltersSelected() {
    this.setState({ dateInput: "" });
    this.setState({ inputValue: 0 });
    this.setState({ descriptionInput: "" });
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

  onInsertClick() {
    let errors = [];

    if (this.state.inputValue === 0 || this.state.idClient < 0) {
      errors.push("Debe Ingresar una cantidad valida");
    }

    if (this.state.descriptionInput === "") {
      errors.push("Debe Ingresar una descripcion del ingreso");
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

    var inputs = 0;
    var outputs = 0;
    var index =
      Number(this.state.Outputs.length) + Number(this.state.Inputs.length);
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
        ActualAmount: actual,
        Index: index
      }
    };

    var product = this.state.invoiceSearchResult[0];
    product.ActualAmount = inputProduct.ActualAmount;
    product.Inputs.push(inputProduct.Input);
    this.props.updateItem(product._id, product, products);
    this.props.getItemsProducts(products);
    this.setState({ ActualAmount: actual });
    this.mix();
  }
  render() {
    const presentations = this.props.item.items;
    const categories = this.props.category.items;
    const products = this.props.product.items;

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
          <ModalBody>
            <div {...html(this.state.message)} />
          </ModalBody>
          <ModalFooter>{this.state.buttons}</ModalFooter>
        </Modal>
        <Row>
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-magnifier" />Buscar Facturas
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
                    <Form className="form-horizontal">
                      <Col md="12">
                        <FormGroup row className="my-0">
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="Product">Factura</Label>
                              <Input
                                type="text"
                                id="Product"
                                name="invoiceNumber"
                                placeholder="Numero Factura"
                                onChange={this.handleChange}
                                value={this.state.invoiceNumber}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="Product">Cliente</Label>
                              <Input
                                type="text"
                                id="Product"
                                name="idClient"
                                placeholder="Identificación Cliente"
                                onChange={this.handleChange}
                                value={this.state.idClient}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="postal-code">Fecha Desde</Label>
                              <Input
                                type="date"
                                id="date-input"
                                name="fromDate"
                                placeholder="date"
                                onChange={this.handleChange}
                                value={this.state.fromDate}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="Product">Fecha Hasta</Label>
                              <Input
                                type="date"
                                id="date-input"
                                name="toDate"
                                placeholder="date"
                                onChange={this.handleChange}
                                value={this.state.toDate}
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <Button
                          type="submit"
                          color="success"
                          onClick={this.onSearchClick}
                        >
                          Buscar
                        </Button>
                        {"  "}
                        <Button color="primary" onClick={this.onClearFilters}>
                          Limpiar
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
            display: this.state.lookInvoices ? "block" : "none"
          }}
        >
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn} />
            <Card>
              <CardHeader>
                <i className="fa icon-login" />
                Facturas
                <div className="card-header-actions">
                  <Button
                    color="link"
                    className="card-header-action btn-minimize"
                    data-target="#collapseExample"
                    onClick={this.toggleInputs}
                  >
                    <i
                      className={
                        this.state.collapseInvoicesResult
                          ? "icon-arrow-up"
                          : "icon-arrow-down"
                      }
                    />
                  </Button>
                </div>
              </CardHeader>
              <Collapse
                isOpen={this.state.collapseInvoicesResult}
                id="collapseExample"
              >
                <CardBody>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Numero Factura</th>
                        <th>Subtotal</th>
                        <th>Total Iva</th>
                        <th>Total</th>
                        <th>N° Articulos</th>
                        <th>Cliente</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.invoiceSearchResult.map(
                        ({
                          _id,
                          date,
                          invoiceNumber,
                          totalProducts,
                          subTotal,
                          totalTax,
                          total,
                          idClient
                        }) => (
                          <tr key={_id}>
                            <td>
                              {moment(date).format("MMMM Do YYYY, h:mm:ss a")}
                            </td>
                            <td>{invoiceNumber}</td>
                            <td>{formatCurrency(subTotal, opts)}</td>
                            <td>{formatCurrency(totalTax, opts)}</td>
                            <td>{formatCurrency(total, opts)}</td>
                            <td>{totalProducts}</td>
                            <td>
                              <NavLink
                                href="#"
                                onClick={this.onClickIdClient.bind(
                                  this,
                                  idClient
                                )}
                              >
                                {idClient}
                              </NavLink>
                            </td>
                            <td>
                              <Button
                                color="primary"
                                onClick={this.onClickFindProducts.bind(
                                  this,
                                  _id
                                )}
                              >
                                <i className="fa fa-cubes" />
                              </Button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

InputProducts.propTypes = {
  addItem: PropTypes.func.isRequired,
  getItemsProducts: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  getInvoices: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  getCustomers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  item: state.item,
  category: state.category,
  product: state.product,
  invoice: state.invoice,
  customers: state.customer.customers
});

export default connect(
  mapStateToProps,
  {
    getItemsPresentations,
    getItemsCategories,
    addItem,
    getItemsProducts,
    updateItem,
    deleteItem,
    getInvoices,
    getCustomers
  }
)(InputProducts);
