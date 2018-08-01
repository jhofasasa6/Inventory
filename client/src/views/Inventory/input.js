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
  Row
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

class InputProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      nameProduct: "",
      idPresentation: "",
      idCategory: "",
      idCodProduct: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleChange(e) {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSearchClick(e) {
    e.preventDefault();
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
    
    if (productSearch.length == 1) this.toggle();
  }

  render() {
    const presentations = this.props.item.items;
    const categories = this.props.category.items;
    const products = this.props.product.items;
    return (
      <div className="animated fadeIn">
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
                      onClick={this.toggle}
                    >
                      <i className="icon-arrow-up" />
                    </Button>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
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
                      </Col>
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn} />
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
