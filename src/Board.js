import React, {useState} from 'react';
import _ from 'lodash';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Button, Col, Container, Row, ListGroup, ListGroupItem} from 'reactstrap';
import {tasks} from './tasks';
import NewTask from "./NewTask";
import TaskDetailsView from "./TaskDetailsView";
import StatusColumn from "./StatusColumn";
import DeleteConfirmModal from "./DeleteConfirmModal";
import NewGroupModal from "./NewGroupModal";
import ManageGroupsModal from "./ManageGroupsModal";
import TaskCard from "./TaskCard";


function Board() {

    const emptyFields = {name: '', description: ''};
    const [newTaskValues, setNewTaskValues] = useState(emptyFields);
    const [taskList, setTaskList] = useState([...tasks]);
    const [modal, setModal] = useState(false);
    const [newGroupModal, setNewGroupModal] = useState(false);
    const [openTaskView, setOpenTaskView] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [taskDetails, setTaskDetails] = useState({});
    // const [taskGroup, setTaskGroup] = useState({status: [...status], colors: [...colors]});
    const [manageModal, setManageModal] = useState(false);


    const addNewTask = (obj) => {
        const changed = _.cloneDeep(taskList);
        //
        // const arr = [...taskList];
        changed[0].items.push(obj);
        setTaskList(changed);
        toggleNewTask();
    };

    const openTask = (obj) => {
        setTaskDetails(obj)
        toggleTaskDetail();
    };
    //
    // const changeTaskStatus = (idx, taskIdx, diff) => {
    //     const arr = [...taskList];
    //     const movedTask = arr[idx].splice(taskIdx, 1);
    //     arr[idx + diff].push(movedTask[0]);
    //     setTaskList(arr)
    // };

    const changeTaskValues = (obj) => {

        let itemIndex;
        let groupIndex;
            taskList.map(group => group.items.map((item, index) => item.id === obj.id ? itemIndex = index : ''));
            taskList.map((group,index) => group.items.map(item => item.id === obj.id ? groupIndex = index : ''));

        const changed = _.cloneDeep(taskList);

        changed[groupIndex].items.splice(itemIndex, 1, obj)

        setTaskList(changed)
    };

    const removeTask = () => {

        let itemIndex;
        let groupIndex;
        taskList.map(group => group.items.map((item, index) => item.id === taskDetails.id ? itemIndex = index : ''));
        taskList.map((group,index) => group.items.map(item => item.id === taskDetails.id ? groupIndex = index : ''));

        const changed = _.cloneDeep(taskList);

        changed[groupIndex].items.splice(itemIndex, 1)

        setTaskList(changed)
    };

    const onDragEnd = (result, taskList, setTaskList) => {
        if (!result.destination) return;
        const {source, destination} = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = taskList[source.droppableId];
            const destColumn = taskList[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            console.log('dest', destItems)
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setTaskList({
                ...taskList,
                [source.droppableId]: {...sourceColumn, items: sourceItems},
                [destination.droppableId]: {...destColumn, items: destItems}
            });
        } else {
            const column = taskList[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setTaskList({...taskList, [source.droppableId]: {...column, items: copiedItems}});
        }
    };

    const toggleTaskDetail = () => setOpenTaskView(!openTaskView);
    const toggleManageGroup = () => setManageModal(!manageModal);
    const toggleNewGroupModal = () => setNewGroupModal(true);
    const toggleDeleteConfirm = () => setOpenDeleteConfirm(!openDeleteConfirm);
    const toggleNewTask = () => setModal(!modal);


    return (
        <Container className="themed-container" fluid="lg">
            <Row className="mb-3" >
                <Col md='4' className=" px-md-1 ">
                    <Button color="primary" onClick={toggleNewTask} className="float-left mr-1">New task</Button>
                    <Button color="primary" onClick={toggleNewGroupModal} className="float-left mr-1">New group</Button>
                    <Button color="primary" onClick={toggleManageGroup} className="float-left mr-1">Manage
                        groups</Button>
                </Col>
                <Col md='2' className=" px-md-1">
                </Col>
                <Col md='6' className=" px-md-1">
                    <a href='https://github.com/aliksayf/react-kanban-board/issues' target="_blank">
                        <Button color="secondary" outline className="float-right">Report issue</Button>
                    </a>
                </Col>
            </Row>
            <Row>
                <DragDropContext onDragEnd={result => onDragEnd(result, taskList, setTaskList)}>
                    {Object.entries(taskList).map(([id, column]) => {
                        return (
                            <ListGroup className="col px-md-1">
                                <ListGroupItem color={column.color} className=" mb-2"><h5>{column.name}</h5></ListGroupItem>
                                {/*<div>*/}
                                    <Droppable droppableId={id} key={id}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    color={column.color}
                                                    column={column}
                                                    removeTask={removeTask}
                                                    setTaskDetails={setTaskDetails}
                                                    openTask={openTask}
                                                    toggleDeleteConfirm={toggleDeleteConfirm}
                                                >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable key={item.id} draggableId={item.id}
                                                                       index={index}>
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div ref={provided.innerRef}
                                                                             {...provided.draggableProps}
                                                                             {...provided.dragHandleProps}
                                                                             style={{
                                                                                 userSelect: 'none',
                                                                                 margin: '0 0 8px 0',
                                                                                 minHeight: '50px',
                                                                                 ...provided.draggableProps.style
                                                                             }}
                                                                        >
                                                                            <TaskCard
                                                                                openTask={openTask}
                                                                                task={item}
                                                                                id={id}/>
                                                                        </div>
                                                                    )
                                                                }}
                                                            </Draggable>
                                                        )
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )
                                        }}
                                    </Droppable>
                                {/*</div>*/}
                            </ListGroup>
                        )
                    })}
                </DragDropContext>
            </Row>


            <NewTask addNewTask={addNewTask}
                     toggleNewTask={toggleNewTask}
                     taskDetails={taskDetails}
                     setTaskDetails={setTaskDetails}
                     modal={modal}/>

            {/*<NewGroupModal*/}
            {/*    taskList={taskList}*/}
            {/*    setTaskList={setTaskList}*/}
            {/*    newGroupModal={newGroupModal}*/}
            {/*    setNewGroupModal={setNewGroupModal}/>*/}

            <TaskDetailsView addNewTask={addNewTask}
                             toggle={toggleTaskDetail}
                             taskDetails={taskDetails}
                             setTaskDetails={setTaskDetails}
                             toggleDeleteConfirm={toggleDeleteConfirm}
                             removeTask={removeTask}
                             changeTaskValues={changeTaskValues}
                             openTaskView={openTaskView}/>

            {/*<ManageGroupsModal taskList={taskList}*/}
            {/*                   setTaskList={setTaskList}*/}
            {/*                   manageModal={manageModal}*/}
            {/*                   setManageModal={setManageModal}*/}
            {/*/>*/}

            <DeleteConfirmModal toggleDeleteConfirm={toggleDeleteConfirm}
                                openDeleteConfirm={openDeleteConfirm}
                                removeTask={removeTask}/>
        </Container>
    );
}

export default Board;
