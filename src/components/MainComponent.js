import React from 'react'
import Header from './Header'
import axios from 'axios'
import './style.css'
let cart = []
export default class MainCompo extends React.Component {
    constructor() {
        super()
        this.state = {
            products: [],
            status: ""
        }
    }
    componentDidMount() {
        axios.get("http://localhost:3001/products").then((posRes) => {
            this.setState({
                status: 'Loading'
            })
            this.setState({
                products: posRes.data,
                status: ''
            })
        }, (errRes) => {
            console.log(errRes)
        })
        this.fetchCart()
    }
    render() {
        return (
            <div className='container-fluid'>
                <Header />
                <div className='h4 text-info mb-2' align="right">
                    Total amount:- {this.calculateTotal()}
                    <button onClick={() => { this.buyNow() }} className='btn btn-outline-success mx-5'>Buy Now</button>
                </div>
                <div className='row'>
                    <div className='col-10'>
                        <div className='row row-cols-3 my-3'>
                            {this.state.products.map((e, i) => (
                                <div className='col my-3'>
                                    <div className='card'>
                                        <div className='card-header'>
                                            <img src={e.pic} className='card-img-top'></img>
                                        </div>
                                        <div className='card-body'>
                                            <div className='h2 card-title'>{e.p_name}</div>
                                            <div className='h4 card-subtitle text-muted'>{e.p_cost}</div>
                                        </div>
                                        <div className='card-footer'>
                                            <button onClick={() => { alert(e.p_desc) }}
                                                className="btn btn-outline-info btn-block btn-sm"
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title={e.p_desc}>Learn More</button>
                                            <button onClick={() => { this.addToCart(e) }} class="btn btn-outline-success btn-block btn-sm">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col'>
                        <div className='row my-3'>
                            {cart.map((e, i) => (
                                <div className='my-3'>
                                    <div className=' card'>
                                        <div className='card-header'>
                                            <img src={e.pic} className='card-img-top'></img>
                                        </div>
                                        <div className='card-body'>
                                            <div className='h2 card-title'>{e.p_name}</div>
                                            <div className='h4 card-subtitle text-muted'>{e.qty}</div>
                                        </div>
                                        <div className='card-footer'>
                                            <button onClick={() => { this.reduce(e) }} class="btn btn-outline-success btn-block btn-sm">Reduce</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    addToCart = (item) => {
        let present = false
        let i
        for (i = 0; i < cart.length; i++) {
            if (item.p_id == cart[i].p_id) {
                present = true
                break
            }
        }
        if (present == true) {
            let myObj = cart[i]
            let id = myObj.id
            let obj = {
                "p_name": myObj.p_name,
                "p_id": myObj.p_id,
                "qty": parseInt(myObj.qty) + 1,
                "p_cost": parseInt(myObj.p_cost),
                "pic": myObj.pic
            }
            axios.put("http://localhost:3001/cart/" + id, obj)
                .then((posRes) => {
                    cart.forEach((e, i) => {
                        if (e.p_id == obj.p_id)
                            e.qty = obj.qty
                    })
                    console.log(posRes.statusText)
                    this.setState({
                        status: 'Update ' + posRes.statusText
                    })
                }, (errRes) => {
                    console.log(errRes)
                    this.setState({
                        status: errRes.message
                    })
                })
        }
        else {
            let obj = {
                "p_name": item.p_name,
                "p_id": item.p_id,
                "qty": 1,
                "p_cost": item.p_cost,
                "pic": item.pic
            }
            axios.post("http://localhost:3001/cart", obj)
                .then((posRes) => {
                    this.setState({
                        status: 'Record' + posRes.statusText
                    })
                    cart.push(obj)
                }, (errRes) => {
                    console.log(errRes)
                })
        }
        this.setState({
            total: this.calculateTotal()
        })
    }
    buyNow = () => {
        alert('Thank u for business with us Total amount :- '+ this.calculateTotal())
        for (let i = 0; i < cart.length; i++) {
            axios.delete("http://localhost:3001/cart/" + cart[i].id)
                .then((posRes) => {
                    console.log(posRes)
                    let indx = cart.findIndex((e, i) => {
                        return e.id === cart[i].id
                    })
                    cart.splice(indx, 1)
                    this.setState({
                        status: 'Delete ' + posRes.statusText
                    })
                }, (errRes) => {
                    console.log(errRes)
                    this.setState({
                        status: errRes.message
                    })
                })
        }
    }
    reduce = (item) => {
        console.log('Item id:- ', item.id)
        if (item.qty == 1) {
            axios.delete("http://localhost:3001/cart/" + item.id)
                .then((posRes) => {
                    console.log(posRes)
                    let indx = cart.findIndex((e, i) => {
                        return e.p_id === item.p_id
                    })
                    cart.splice(indx, 1)
                    this.setState({
                        status: 'Delete ' + posRes.statusText
                    })
                }, (errRes) => {
                    console.log(errRes)
                    this.setState({
                        status: errRes.message
                    })
                })
        }
        else {
            let obj = {
                "p_name": item.p_name,
                "p_id": item.p_id,
                "qty": parseInt(item.qty) - 1,
                "p_cost": parseInt(item.p_cost)
            }
            axios.put("http://localhost:3001/cart/" + item.id, obj)
                .then((posRes) => {
                    cart.forEach((e, i) => {
                        if (e.p_id == obj.p_id)
                            e.qty = obj.qty
                    })
                    console.log(posRes.statusText)
                    this.setState({
                        status: 'Update ' + posRes.statusText
                    })
                }, (errRes) => {
                    console.log(errRes)
                    this.setState({
                        status: errRes.message
                    })
                })
        }
        this.setState({
            total: this.calculateTotal()
        })
    }
    fetchCart = () => {
        axios.get("http://localhost:3001/cart").then((posRes) => {
            this.setState({
                status: 'Loading'
            })
            cart = posRes.data
            this.setState({
                status: '',
            })
        }, (errRes) => {
            console.log(errRes)
        })
        let total = 0
        for (let i = 0; i < cart.length; i++) {
            debugger
            total += cart[i].p_cost * cart[i].qty
        }
        this.setState({
            total: total
        })
    }
    calculateTotal = () => {
        let total = 0
        cart.forEach((e, i) => {
            total += e.qty * e.p_cost
        })
        return total
    }
}
