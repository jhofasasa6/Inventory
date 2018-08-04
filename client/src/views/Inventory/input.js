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
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  NavLink
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
moment.locale("es");
class InputProducts extends Component {
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
      classModal : ""
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
      this.setState(({classModal : 'modal-danger ' + this.props.className}));
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
                        <Button color="warning" onClick={this.onClearFilters}>
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
                      </tr>
                    </thead>
                    <tbody>
                      {productsFind.map(
                        ({ _id, name, presentation, category, sku }) => (
                          <tr key={_id}>
                            <td>{name}</td>
                            <td>
                              {presentation.name} x {presentation.quantity}
                            </td>
                            <td>{category.name}</td>
                            <td>
                              {" "}
                              <NavLink
                                href="#"
                                onClick={this.onSelectProduct.bind(this, _id)}
                              >
                                {sku}
                              </NavLink>
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
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <Button color="success" onClick={this.onInsertClick}>
                          Ingresar
                        </Button>
                        {"  "}
                        <Button
                          color="warning"
                          onClick={this.onClearFiltersSelected}
                        >
                          Limpiar
                        </Button>
                      </Col>
                    </Form>
                  </CardBody>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Fecha Ingreso</th>
                        <th>Descripción</th>
                        <th>Cantidad Ingreso</th>
                        <th>Cantidad Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.Inputs.map(
                        ({
                          _id,
                          DescriptionInput,
                          Input,
                          CreationDate,
                          ActualAmount
                        }) => (
                          <tr key={_id}>
                            <td>
                              {moment(CreationDate).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </td>
                            <td>
                              <small>{DescriptionInput}</small>
                            </td>
                            <td>{Input}</td>
                            <td>{ActualAmount}</td>
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

InputProducts.PropTypes = {
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
)(InputProducts);
