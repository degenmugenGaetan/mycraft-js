Members = Members or {}
Messages = Messages or {}

Handlers.add(
  "register",
  Handlers.utils.hasMatchingTag("Action", "Register"),
  function (msg)
    table.insert(Members, msg.From)
    Handlers.utils.reply("registered")(msg)
  end
)

Handlers.add(
  "getMessages",
  Handlers.utils.hasMatchingTag("Action", "GetMessages"),
  function (msg)
    -- Return only the last message to the requester
    local lastMessage = Messages[#Messages] or {}
    ao.send({Target = msg.From, Data = lastMessage})
    Handlers.utils.reply(lastMessage["Data"])
  end
)

Handlers.add(
  "setMessages",
  Handlers.utils.hasMatchingTag("Action", "SetMessages"),
  function (msg)
    -- Save the message to the Messages table
    table.insert(Messages, {From = msg.From, Data = msg.Data})

    Handlers.utils.reply("SetMessages.")(msg)
  end
)

Handlers.add(
  "resetMessages",
  Handlers.utils.hasMatchingTag("Action", "ResetMessages"),
  function ()
    Messages = {}
  end
)