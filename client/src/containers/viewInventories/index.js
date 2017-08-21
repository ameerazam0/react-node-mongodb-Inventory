import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getInventories } from "./../../actions/InventoryActions";

class AddInventory extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getInventories({ token: token }));
    }
    render() {
        const { inventories, isFetchingInventories, fetchingInventoriesError } = this.props.inventory;
        let error = null;
        if (fetchingInventoriesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Inventory</Message.Header>
                    <p>{fetchingInventoriesError}</p>
                </Message>
            )
        }
        const inventoriesView = inventories.map(function (inventory) {
            return (
                <Table.Row key={inventory.id}>
                    <Table.Cell>{inventory.productId}</Table.Cell>
                    <Table.Cell>{inventory.productName.en}</Table.Cell>
                    <Table.Cell>{inventory.status}</Table.Cell>
                    <Table.Cell >{inventory.mrp}</Table.Cell>
                    <Table.Cell >{inventory.quantity}</Table.Cell>
                    <Table.Cell >{inventory.batch.number}</Table.Cell>
                    <Table.Cell >{inventory.batch.date}</Table.Cell>
                </Table.Row>
            )
        });
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Inventory List</Header>
                    {error}
                    <Segment loading={isFetchingInventories}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Product ID</Table.HeaderCell>
                                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                    <Table.HeaderCell>MRP</Table.HeaderCell>
                                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                                    <Table.HeaderCell>Batch Number</Table.HeaderCell>
                                    <Table.HeaderCell>Batch Date</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {inventoriesView}
                            </Table.Body>
                        </Table>
                    </Segment>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        inventory: state.inventory
    }
}

export default connect(mapStatesToProps)(AddInventory);
