import { useState } from "react";

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

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowFriend] = useState(false);
  const [friends, setFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowFriend((show) => !show);
  }

  function HandleAddNewF(friend) {
    setFriend((friends) => [...friends, friend]);
    setShowFriend(false);
  }

  function HandleSelectedF(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((curr)=> (curr === friend ? null : friend));
    setShowFriend(false);
  }

  function HandleSplitBill(value){
    setFriend(friends => friends.map(friend=> friend.id===selectedFriend.id ? {...friend, balance: friend.balance + value } : friend));

   setSelectedFriend(null); 

  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onselection={HandleSelectedF}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriends={HandleAddNewF} />}
        <button className="button" onClick={handleShowAddFriend}>
          {" "}
          {showAddFriend ? "Close" : "Add Friend"}
        </button>
      </div>
      {selectedFriend && <FormSplitBill 
        selectedFriend={selectedFriend} 
        onSplitBill= {HandleSplitBill} 
        key={selectedFriend.id} />}
    </div>
  );
}

export default App;

function FriendList({ friends, onselection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friends) => (
        <Friend
          friends={friends}
          key={friends.id}
          onselection={onselection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friends, onselection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friends.id;
  return (
    <li>
      <img src={friends.image} alt="friends" />
      <h1>{friends.name}</h1>
      {friends.balance < 0 && (
        <p className="red">You owe your friend {friends.balance}</p>
      )}
      {friends.balance > 0 && (
        <p className="green">Your friend ows you {friends.balance}</p>
      )}
      {friends.balance === 0 && <p>You both are even</p>}
      <button className="button" onClick={() => onselection(friends)} >
      {isSelected?'Close': 'Select'}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState("");
  const [imageName, setImage] = useState("https://i.pravatar.cc/48?u=");

  function HandleSubmit(e) {
    e.preventDefault();

    if (!name || !imageName) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${imageName}${id}`,
      balance: 0,
    };
    onAddFriends(newFriend);

    setImage("https://i.pravatar.cc/48?u=");
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={HandleSubmit}>
      <label>👫Friend's Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🫥Friend's Image:</label>
      <input
        type="text"
        value={imageName}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] =useState("");
  const [paidByUser, setPaidByUser]= useState("");
  const friendexpense= bill? bill-paidByUser : "";
  const [whoisPaying, setWhoisPaying]= useState('user');


function HandleSubmit(e){
  e.preventDefault();
  if(!bill || !paidByUser) return;

  onSplitBill(whoisPaying === 'user' ? friendexpense : -paidByUser)
}


  return (
    <form className="form-split-bill" onSubmit={HandleSubmit}>
      <h2> Split a bill with {selectedFriend.name}📝 </h2>
      <label>💰 Bill Value:</label>
      <input type="text" 
      value={bill} 
      onChange={(e)=> setBill(Number(e.target.value))}>
      </input>

      <label>💰 Your Expense:</label>
      <input type="text" value={paidByUser} 
      onChange={(e)=> setPaidByUser(Number(e.target.value) > bill ? paidByUser : (Number(e.target.value)))}></input>

      <label>💰 {selectedFriend.name}'s Expense:</label>
      <input type="text" disabled value={friendexpense}></input>

      <label>Who is Paying the Bill?</label>
      <select value={whoisPaying} 
      onChange={(e)=> setWhoisPaying(e.target.value)}>
        <option value='user' >You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <button className="button">Split a bill</button>
    </form>
  );
}
