import React, {Component, useEffect, useState} from 'react';

import {Grid, Row, Col, Panel} from 'react-bootstrap';
import {Button, ButtonGroup, ButtonToolbar, Modal} from 'react-bootstrap';
import {InputGroup, FormControl} from 'react-bootstrap';
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Loader from 'react-loader-spinner';
import axios from 'axios';

import getWeb3 from './utils/getWeb3';
import TruffleContract from '@truffle/contract';
import SimpleStorage from './contracts/SimpleStorage';

import './css/bootstrap.min.css';
import './css/style.css';


class Main extends Component {

    state = {
        web3: null,
        accounts: null,
        contract: null,
        networkId: null,

        val: 0,
        storedData: '',
        pending: false,
        show: false,
        msg: ''
    };

    async componentDidMount() {

        try {

            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            // const deployedNetwork = SimpleStorage.networks[networkId];
            // const instance = new web3.eth.Contract(
            //     SimpleStorage.abi,
            //     deployedNetwork && deployedNetwork.address,
            // );

            const Contract = TruffleContract(SimpleStorage);
            Contract.setProvider(web3.currentProvider);
            const instance = await Contract.deployed();

            // instance.events.Change({topics: ['0xbb1cb5be1009ed69d54a8f3da20ed253be50c4dbbcade4f0a12114dedd9be5d7',
            //     '0x0000000000000000000000000000000000000000000000000000000000001388']})
            //     .on('data', (event) => {
            //         this.handleEvent(event);
            //     })
            //     .on('error', (err) => { console.log(err) } );

            web3.eth.subscribe("logs", {address: instance.address})
                .on('data', (log) => {
                    this.handleLog(log);
                })
                .on('error', (err) => console.log(err));


            this.setState({web3, accounts, networkId, contract: instance});


        } catch (error) {
            // Catch any errors for any of the above operations.
            alert('Failed to load web3, accounts, or contract. Check console for details.');
            console.log(error);
        }
    }

    handleSend = async () => {

        const {accounts, contract} = this.state;

        if (this.state.val> 0) {

            this.setState({pending: !this.state.pending});

            try {
                //await contract.methods.set(this.state.val).send({from:accounts[0]});
                await contract.set(this.state.val, {from:accounts[0]});

            } catch (err) {
                console.log(err.message);
                this.setState({pending: false, show: true, msg: err.message});
            }
        }
    }

    handleSendApi = async () => {

        const {web3, accounts} = this.state;

        if (this.state.val> 0) {

            try {

                this.setState({pending: !this.state.pending});

                const result = await axios.post('/eth/set', {from: accounts[0], val: this.state.val});

                if ( result !== undefined && result.data !== undefined && result.data.rawTx !== undefined ) {
                    await web3.eth.sendTransaction(result.data.rawTx);
                }

            } catch (err) {
                console.log(err);
                this.setState({pending: false, show: true, msg: err.message});
            }
        }
    }

    handleSendTx = async () => {

        const {accounts} = this.state;

        if (this.state.val> 0) {

            try {
                this.setState({pending: !this.state.pending});
                //TODO 다음 from 부분을 메타마스크의 계정으로 변경하십시오.
                const result = await axios.post('/eth/setTx', {from: "0x6C1b86657256A2Bb548B11EE332049451ce5ca93", val: this.state.val});

                console.log(result);

            } catch (err) {
                console.log(err);
                this.setState({pending: false, show: true, msg: err.message});
            }
        }

    }


    handleEvent = (event) => {
        this.setState({pending: !this.state.pending, storedData: event.returnValues.newVal});
    }

    handleLog = (log) => {

        const {web3} = this.state;
        const params = [{type: 'string', name: 'message'}, {type: 'uint256', name: 'newVal'}];
        const returnValues = web3.eth.abi.decodeLog(params, log.data);

        this.setState({pending: !this.state.pending, storedData: returnValues.newVal});
    }

    handleChange = (e) => {

        let val = 0;
        if (e.target.value !== "") {
            val = parseInt(e.target.value);
        }
        this.setState({val});
    }


    handleClose = () => {
        this.setState({show: false, msg: ''});
    }


    render() {

        return (

            <Grid fluid={true}>
                <Row>
                    <Col md={5}>
                        <InputGroup style={{paddingBottom:'10px'}}>
                            <InputGroup.Addon>Value</InputGroup.Addon>
                            <FormControl type="number" placeholder="Enter number" bsSize="lg" onChange={this.handleChange} min={0} />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={5} style={{textAlign: "center"}}>
                        <div className="button">
                            <ButtonToolbar>
                                <ButtonGroup justified>
                                    <Button href="#" bsStyle="primary" bsSize="large" block onClick={this.handleSend}>
                                        Send via Metamask
                                    </Button>
                                    <Button href="#" bsStyle="success" bsSize="large" block onClick={this.handleSendApi}>
                                        Send via Server API
                                    </Button>
                                    <Button href="#" bsStyle="info" bsSize="large" block onClick={this.handleSendTx}>
                                        Send via Server(Sign)
                                    </Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </div>
                    </Col>
                </Row>

                <Row style={{marginTop:'10px'}}>
                    <Col md={5}>
                        <Panel bsStyle="info">
                            <Panel.Heading>
                                <Panel.Title>
                                    <Glyphicon glyph="signal" /> Stored Data - Event
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <div style={{display:"inline-block"}}>
                                    <p>
                                        {this.state.storedData}
                                    </p>
                                </div>
                                <div style={{display:"inline-block", float:"right"}}>
                                    {this.state.pending?<Loader type="Grid" color="#CE62D4" height="50" width="50"/>:null}
                                </div>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Message show={this.state.show} msg={this.state.msg} close={this.handleClose}/>

            </Grid>

        )

    }
}


export default Main;


const Message = (props) => {

    const [flag, setFlag] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {

        if (props.msg.toString().startsWith("Error")) {
            setMsg('JSON-RPC or SERVER ERROR');
        } else {
            setMsg(props.msg);
        }
        setFlag(props.show);

    }, [props.show]);

    return (
        <Modal show={flag} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Life is not easy for any of us <span role={"img"} aria-labelledby={"emoji"}>😅</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {msg}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.close}>Close</Button>
            </Modal.Footer>
        </Modal>
    )

}
