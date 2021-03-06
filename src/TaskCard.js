import React from 'react';
import {FiAlertTriangle, FiChevronsLeft, FiChevronsRight, FiTrash2} from "react-icons/fi";
import {Button, Col, Label, ListGroupItem, Row} from "reactstrap";

const TaskCard = (props) => {

    const {
        task,
        idx,
        changeTaskStatus,
        openTask,
        toggleDeleteConfirm,
        setTaskDetails
    } = props;

    const priorityColors = {
        Low: "light",
        Mid: "warning",
        High: "danger"
    }

    console.log()

    const leftButtonDisplays = (i) => i === 0 ? ' hidden' : '';
    const rightButtonDisplays = (i) => i === 3 ? ' hidden' : '';

    const buttonRightHandler = () => {
        changeTaskStatus(task.id, +1);
    };

    const buttonLeftHandler = () => {
        changeTaskStatus(task.id, -1);
    };

    const onTaskClickHandler = () => {
        openTask(task);
    };

    const deleteHandler = () => {
        setTaskDetails(task);
        toggleDeleteConfirm();
    };


    return (
        <div>
            <ListGroupItem className="bg-light">
                <Row className="pointer" onClick={onTaskClickHandler} color='danger'>
                    <Col xs="1">
                        <FiAlertTriangle className={priorityColors[task.priority] + " text-xs-right"}/>
                    </Col>
                    <Col lg="10">
                        <Label className="pointer overflow-name text-left" onClick={onTaskClickHandler}>
                            <strong >{task.name}</strong>
                        </Label>
                        <p><i>details...</i></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            color="secondary"
                            outline
                            pill
                            size="sm"
                            onClick={buttonLeftHandler}
                            className={leftButtonDisplays(idx) + ' pointer float-left'}><FiChevronsLeft/></Button>
                    </Col>
                    <Col>
                        <Col>
                            <Button onClick={deleteHandler} pill className='float-right' size="sm"
                                    color='danger'><FiTrash2/></Button>
                        </Col>
                    </Col>
                    <Col>
                        <Button
                            color="secondary"
                            outline
                            pill
                            size="sm"
                            onClick={buttonRightHandler}
                            className={rightButtonDisplays(idx) + ' pointer float-right'}><FiChevronsRight/></Button>
                    </Col>
                </Row>
            </ListGroupItem>
        </div>
    );
};

export default TaskCard;