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
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { presentation } from "../../actions/types";
import { categories } from "../../actions/types";
import { products } from "../../actions/types";
import uuid from "uuid";
import moment from "moment";
import { AppSwitch } from "@coreui/react";
moment.locale("es");
class InputProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: [false, false],
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
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
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
    if (!this.state.productSearchResult.filter(x => x._id === _id)[0].enable) {
      this.setState({ enable: true });
      this.setState({ error: "Producto no disponible" });
    } else {
      this.setState({ enable: false });
      this.setState({ error: "" });
    }

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
      Outputs: this.state.productSearchResult.filter(x => x._id === _id)[0]
        .Outputs
    });

    this.mix();

    this.setState({
      ActualAmount: this.state.productSearchResult.filter(x => x._id === _id)[0]
        .ActualAmount
    });

    this.toggleFilters();
    this.toggleResult();
  }

  mix() {
    let mezclas = [];
    this.state.productSearchResult[0].Inputs.map(
      ({ _id, DescriptionInput, Input, CreationDate, ActualAmount, Index }) =>
        mezclas.push({
          _id: _id,
          date: CreationDate,
          description: DescriptionInput,
          quantity: Input,
          actualAmount: ActualAmount,
          index: Index,
          type: "I" //Input
        })
    );

    this.state.productSearchResult[0].Outputs.map(
      ({ _id, DescriptionOutput, Output, CreationDate, ActualAmount, Index }) =>
        mezclas.push({
          _id: _id,
          date: CreationDate,
          description: DescriptionOutput,
          quantity: Output,
          actualAmount: ActualAmount,
          index: Index,
          type: "O" //Output
        })
    );

    mezclas.sort(function(a, b) {
      if (a.index > b.index) {
        return 1;
      }
      if (a.index < b.index) {
        return -1;
      }
      return 0;
    });
    this.setState({ mix: mezclas });
    console.log(this.state.mix);
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

  onSearchClick(e) {
    e.preventDefault();

    if (
      this.state.nameProduct === "" &&
      this.state.idPresentation === "" &&
      this.state.idCategory === "" &&
      this.state.idCodProduct === ""
    ) {
      this.configModal(
        "modal-danger ",
        "Busqueda",
        "ingrese algunos de los filtros para la busqueda",
        "Aceptar"
      );
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
      this.configModal(
        "modal-danger ",
        "Busqueda",
        "No se encontraron articulos con los filtros ingresados",
        "Aceptar"
      );
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

    var product = this.state.productSearchResult[0];
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
        <Row>
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-magnifier" />Entradas de Producto
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
            display:
              this.state.productSearchResult.length > 0 ? "block" : "none"
          }}
        >
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn} />
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />{" "}
                {this.state.productSelected
                  ? this.state.productSelected
                  : "Seleccione Producto"}
                <div className="card-header-actions">
                  <Button
                    color="link"
                    className="card-header-action btn-minimize"
                    data-target="#collapseExample"
                    onClick={this.toggleResult}
                  >
                    <i
                      className={
                        this.state.collapseResult
                          ? "icon-arrow-up"
                          : "icon-arrow-down"
                      }
                    />
                  </Button>
                </div>
              </CardHeader>
              <Collapse isOpen={this.state.collapseResult} id="collapseExample">
                <CardBody>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Presentación</th>
                        <th>Categoria</th>
                        <th>Codigo Interno</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {productsFind.map(
                        ({
                          _id,
                          name,
                          presentation,
                          category,
                          sku,
                          enable
                        }) => (
                          <tr
                            key={_id}
                            style={
                              !enable
                                ? {
                                    backgroundColor: "#f86c6b"
                                  }
                                : {
                                    backgroundColor: ""
                                  }
                            }
                          >
                            <td>{!enable ? <del>{name}</del> : name}</td>
                            <td>
                              {!enable ? (
                                <del>
                                  {presentation.name} x {presentation.quantity}
                                </del>
                              ) : (
                                presentation.name + "x" + presentation.quantity
                              )}
                            </td>
                            <td>
                              {!enable ? (
                                <del>{category.name}</del>
                              ) : (
                                category.name
                              )}
                            </td>
                            <td>
                              {" "}
                              <NavLink
                                href="#"
                                onClick={this.onSelectProduct.bind(this, _id)}
                                style={
                                  !enable
                                    ? {
                                        color: "#fff"
                                      }
                                    : {
                                        backgroundColor: ""
                                      }
                                }
                              >
                                {sku}
                              </NavLink>
                            </td>
                            <td>
                              {!enable ? <i class="fa fa-lock fa-lg" /> : ""}
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

        <Row
          style={{
            display: this.state.lookInputs ? "block" : "none"
          }}
        >
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn} />
            <Card>
              <CardHeader>
                <i className="fa icon-login" />
                Entradas
                <div className="card-header-actions">
                  <Button
                    color="link"
                    className="card-header-action btn-minimize"
                    data-target="#collapseExample"
                    onClick={this.toggleInputs}
                  >
                    <i
                      className={
                        this.state.collapseInputs
                          ? "icon-arrow-up"
                          : "icon-arrow-down"
                      }
                    />
                  </Button>
                </div>
              </CardHeader>
              <Collapse isOpen={this.state.collapseInputs} id="collapseExample">
                <CardBody>
                  <CardBody>
                    <Form className="form-horizontal">
                      <Col md="12">
                        <FormGroup row className="my-0">
                          <Col xs="1">
                            <FormGroup>
                              <Label htmlFor="Product">Cantidad Actual</Label>
                              <Input
                                type="text"
                                id="disabled-input"
                                name="ActualAmount"
                                value={this.state.ActualAmount}
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <Label htmlFor="Product">Fecha Ingreso</Label>
                              <Input
                                type="text"
                                id="dateInput"
                                name="dateInput"
                                placeholder="Fecha Ingreso"
                                onChange={this.handleChange}
                                value={moment().format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="2">
                            <FormGroup>
                              <Label htmlFor="postal-code">
                                Cantidad a Ingresar
                              </Label>
                              <Input
                                type="number"
                                name="inputValue"
                                id="inputValue"
                                onChange={this.handleChange}
                                value={this.state.inputValue}
                                disabled={this.state.enable}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="postal-code">
                                Descripción del Ingreso{" "}
                              </Label>
                              <Input
                                type="textarea"
                                name="descriptionInput"
                                id="idPresentation"
                                onChange={this.handleChange}
                                value={this.state.descriptionInput}
                                disabled={this.state.enable}
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <Button
                          color="success"
                          onClick={this.onInsertClick}
                          disabled={this.state.enable}
                        >
                          Ingresar
                        </Button>
                        {"  "}
                        <Button
                          color="primary"
                          onClick={this.onClearFiltersSelected}
                        >
                          Limpiar
                        </Button>
                      </Col>
                      <Col md="12" style={{ textAlign: "center" }}>
                        <small>
                          <Label style={{ color: "#f86c6b" }}>
                            <b>{this.state.error}</b>
                          </Label>
                        </small>
                      </Col>
                      <Col md="12" style={{ textAlign: "right" }}>
                        <a href="#" id="TooltipExample">
                          <AppSwitch
                            className={"mx-1"}
                            // variant={"pill"}
                            color={"danger"}
                            id="lookOutputs"
                            onChange={this.onlookOutputs}
                          />
                        </a>
                      </Col>
                    </Form>
                  </CardBody>
                  <Tooltip
                    placement="top"
                    isOpen={this.state.tooltipOpen[0]}
                    target="TooltipExample"
                    toggle={() => {
                      this.toggleTooltip(0);
                    }}
                  >
                    Ver Salidas
                  </Tooltip>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Cantidad Actual</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.mix.map(
                        ({
                          _id,
                          description,
                          quantity,
                          date,
                          actualAmount,
                          index,
                          type
                        }) => (
                          <tr
                            key={_id}
                            style={
                              type === "I"
                                ? {
                                    backgroundColor: ""
                                  }
                                : {
                                    display: this.state.lookOutputs,
                                    backgroundColor: "#f86c6b"
                                  }
                            }
                          >
                            <td>
                              {moment(date).format("MMMM Do YYYY, h:mm:ss a")}
                            </td>
                            <td>
                              <small>{description}</small>
                            </td>
                            <td>{quantity}</td>
                            <td>{actualAmount}</td>
                            <td>
                              {type === "I" ? (
                                <i className="fa icon-login" />
                              ) : (
                                <i className="fa icon-logout" />
                              )}
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
)(InputProducts);
