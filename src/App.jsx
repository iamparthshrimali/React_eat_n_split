import React, { useRef, useState } from 'react'

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];


const App = () => {
    const [showAddFriendForm, setShowAddFriendForm] = useState(false);
    const [friends, setFriends] = useState(initialFriends)
    const [selectedFriend, setSelectedFriend] = useState(null)

    const handleShowAddForm = () => {
        setShowAddFriendForm(isOpen => !isOpen)
    }
    const handleAddFriend = (newFriend) => {
        setFriends(friends => [...friends, newFriend])
        setShowAddFriendForm(false)
    }

    const handleSelectionFriend = (friend) => {

        setSelectedFriend(currSelected => (currSelected?.id === friend.id ? null : friend))
        setShowAddFriendForm(false)
    
    }

    const handleSplitBill = (value) => {
        console.log(value)
        setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))
        setShowAddFriendForm(false )
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendsList friends={friends} onSelectFriend={handleSelectionFriend} currSelected={selectedFriend} />
                {showAddFriendForm && <FormAddFriend onAddFriend={handleAddFriend} />}
                <Button onClick={() => handleShowAddForm()}>{!showAddFriendForm ? "Add Friend" : "Close"}</Button>
            </div>
            {selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />}
        </div>
    )
}


function FriendsList({ friends, onSelectFriend, currSelected }) {



    return <ul>
        {
            friends.map(friend => <Friend friend={friend} key={friend.id} onSelectFriend={onSelectFriend} currSelected={currSelected} />)
        }

    </ul>
}

function Friend({ friend, onSelectFriend, currSelected }) {
    const isSelected = friend.id === currSelected?.id;
    return (
        <>
            <li className={`${isSelected ? "selected" : ""}`}>
                <img src={friend.image} alt="friend.name" />
                <h3>{friend.name}</h3>
                {friend.balance < 0 &&
                    <p className='red'>You owe {friend.name} {friend.balance}</p>
                }
                {friend.balance > 0 &&
                    <p className='green'> {friend.name} owes you {friend.balance}</p>
                }
                {friend.balance === 0 &&
                    <p> You and {friend.name} are even</p>
                }
                <Button onClick={() => onSelectFriend(friend)}>Select</Button>
            </li>
        </>
    )
}

function FormAddFriend({ onAddFriend }) {
    const friendNameRef = useRef();
    const friendImageRef = useRef();
    const handleSubmit = (e) => {
        e.preventDefault();


        const id = crypto.randomUUID();
        const friendName = friendNameRef.current.value;
        const friendImage = friendImageRef.current.value;
        if (!friendImage || !friendName) return;
        const newFriend = {
            id,
            name: friendName,
            image: `${friendImage}?=${id}`,
            balance: 0
        }
        onAddFriend(newFriend)
    }

    return (
        <>
            <form className="form-add-friend" onSubmit={handleSubmit}>
                <label htmlFor="fname">👬 Friend Name</label>
                <input type="text" name="" id="fname" ref={friendNameRef} />

                <label htmlFor="fimage">😎 Image Url</label>
                <input type="text" name="" id="fimage" defaultValue={"https://i.pravatar.cc/48?u=499476"} ref={friendImageRef} />


                <Button>Add</Button>
            </form>
        </>
    )
}


function FormSplitBill({ friend, onSplitBill }) {
    const initialFormData = {
        bill: "",
        yourExpenses: "",
        whoIsPaying: "you"
    }
    const [formData, setFormData] = useState(initialFormData);
    const friendExpenses = formData.bill ? formData.bill - formData.yourExpenses : "";
    const handleChange = (e) => {
        let { name, value } = e.target;
        if(name!=="whoIsPaying")
            value=Number(value);
        if (name === "yourExpenses")
            if (value > formData.bill) return;
        setFormData({ ...formData, [name]: value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
     
        
        onSplitBill(formData.whoIsPaying === "user" ? friendExpenses : -formData.yourExpenses)
    }


    return (
        <form className='form-split-bill' onSubmit={handleSubmit}>
            <h2>Split a bil with {friend.name}</h2>

            <label htmlFor="bil_value">💰 Bill Value</label>
            <input type="text" name="bill" onChange={handleChange} id="bill_value" />

            <label htmlFor="bil_value">🕺 Your Expense</label>
            <input type="text" name="yourExpenses" onChange={handleChange} value={formData.yourExpenses} id="bill_value" />

            <label htmlFor="f_expense">👭 {friend.name}'s expense</label>
            <input type="text" value={friendExpenses} id="f_expense" disabled />

            <label htmlFor="payer">🤑Who is paying the bill ?</label>
            <select name="whoIsPaying" id="payer" onChange={handleChange} >
                <option value="user">You</option>
                <option value="friend">{friend.name}</option>
            </select>

            <Button>Split bill</Button>

        </form>
    )
}

function Button({ children, onClick }) {
    return <button className="button" onClick={onClick}>{children}</button>
}

export default App