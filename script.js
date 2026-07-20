window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

const homeView = document.querySelector("#homeView");
const chatView = document.querySelector("#chatView");
const settingsView = document.querySelector("#settingsView");
const wallpaper = document.querySelector(".wallpaper");
const openChatButtons = document.querySelectorAll("[data-open-chat]");
const openSettingsBtn = document.querySelector("#openSettingsBtn");
const backBtn = document.querySelector("#backBtn");
const settingsBackBtn = document.querySelector("#settingsBackBtn");
const composer = document.querySelector("#composer");
const input = document.querySelector("#messageInput");
const messages = document.querySelector("#messages");
const clock = document.querySelector("#clock");
const phoneScreen = document.querySelector("#phoneScreen");
const brandBear = document.querySelector("#brandBear");
const bearPopover = document.querySelector("#bearPopover");
const deleteBearBtn = document.querySelector("#deleteBearBtn");
const bearAddModal = document.querySelector("#bearAddModal");
const cancelAddBearBtn = document.querySelector("#cancelAddBearBtn");
const confirmAddBearBtn = document.querySelector("#confirmAddBearBtn");
const toolBtn = document.querySelector("#toolBtn");
const toolPanel = document.querySelector("#toolPanel");
const addContactBtn = document.querySelector("#addContactBtn");
const addMomentBtn = document.querySelector("#addMomentBtn");
const addGroupBtn = document.querySelector("#addGroupBtn");
const avatarToggle = document.querySelector("#avatarToggle");
const topDistanceRange = document.querySelector("#topDistanceRange");
const topDistanceValue = document.querySelector("#topDistanceValue");
const phoneStatusToggle = document.querySelector("#phoneStatusToggle");
const chatHeaderTitle = document.querySelector("#chatHeaderTitle");
const chatHeaderSubtitle = document.querySelector("#chatHeaderSubtitle");
const headerAvatar = document.querySelector(".header-avatar");
const conversationSearch = document.querySelector("#conversationSearch");
const conversationList = document.querySelector("#conversationList");
const conversationDetail = document.querySelector("#conversationDetail");
const contactList = document.querySelector("#contactList");
const momentsList = document.querySelector("#momentsList");
const contactModal = document.querySelector("#contactModal");
const deleteModal = document.querySelector("#deleteModal");
const deleteTitle = document.querySelector("#deleteTitle");
const deleteMessage = document.querySelector("#deleteMessage");
const closeContactModal = document.querySelector("#closeContactModal");
const avatarEditor = document.querySelector("#avatarEditor");
const editAvatarPreview = document.querySelector("#editAvatarPreview");
const contactNameInput = document.querySelector("#contactNameInput");
const contactPersonaInput = document.querySelector("#contactPersonaInput");
const saveContactBtn = document.querySelector("#saveContactBtn");
const avatarFileInput = document.querySelector("#avatarFileInput");
const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
const momentModal = document.querySelector("#momentModal");
const closeMomentModalBtn = document.querySelector("#closeMomentModal");
const momentTextInput = document.querySelector("#momentTextInput");
const momentPreview = document.querySelector("#momentPreview");
const momentCameraBtn = document.querySelector("#momentCameraBtn");
const cameraOptions = document.querySelector("#cameraOptions");
const uploadMomentImageBtn = document.querySelector("#uploadMomentImageBtn");
const useTextImageBtn = document.querySelector("#useTextImageBtn");
const publishMomentBtn = document.querySelector("#publishMomentBtn");
const momentImageInput = document.querySelector("#momentImageInput");
const groupModal = document.querySelector("#groupModal");
const closeGroupModalBtn = document.querySelector("#closeGroupModal");
const groupAvatarEditor = document.querySelector("#groupAvatarEditor");
const groupAvatarPreview = document.querySelector("#groupAvatarPreview");
const groupNameInput = document.querySelector("#groupNameInput");
const groupMemberList = document.querySelector("#groupMemberList");
const groupHint = document.querySelector("#groupHint");
const saveGroupBtn = document.querySelector("#saveGroupBtn");
const groupAvatarFileInput = document.querySelector("#groupAvatarFileInput");
const chatTabButtons = document.querySelectorAll("[data-chat-tab]");
const chatTabs = document.querySelector(".chat-tabs");
const chatTabPanels = {
  dialog: document.querySelector("#dialogPanel"),
  contacts: document.querySelector("#contactsPanel"),
  moments: document.querySelector("#momentsPanel"),
  me: document.querySelector("#mePanel")
};

const TOP_DISTANCE_KEY = "mini-phone-top-distance";
const PHONE_STATUS_KEY = "mini-phone-show-status";
const BEAR_POSITION_KEY = "mini-phone-bear-position";
const BEAR_VISIBLE_KEY = "mini-phone-bear-visible";
const CONTACTS_KEY = "mini-phone-contacts";
const OLD_MESSAGES_KEY = "mini-phone-chat-messages";
const CONVERSATIONS_KEY = "mini-phone-conversations";
const GROUPS_KEY = "mini-phone-groups";
const MOMENTS_KEY = "mini-phone-moments";
const AVATAR_VISIBILITY_KEY = "mini-phone-show-chat-avatars";
const TOP_DISTANCE_MIN = Number(topDistanceRange.min);
const TOP_DISTANCE_MAX = Number(topDistanceRange.max);
const defaultMessages = [
  { type: "other", text: "你好呀，欢迎来到这个小手机。", time: "09:36" },
  { type: "mine", text: "我可以点开聊天了！", time: "09:38" },
  { type: "other", text: "下面输入一句话，我会给你一个简单回复。", time: "09:39" }
];
const defaultContact = {
  id: "ni",
  name: "Ni 小助手",
  note: "你的聊天联系人",
  avatarText: "N",
  avatarImage: "",
  persona: "",
  pinned: false,
  chatEnabled: true
};
const replies = [
  "收到，这个界面已经像一个小聊天软件了。",
  "你可以继续打字，我会陪你测试。",
  "这个小手机还可以继续加相册、设置、联系人。",
  "消息已送达，交互也跑起来了。"
];

let bearLongPressTimer;
let wallpaperLongPressTimer;
let lastBearTapAt = 0;
let isDraggingBear = false;
let activeContactId = "";
let pendingDeleteAction = null;
let avatarDraft = "";
let groupAvatarDraft = "";
let activeConversationId = "ni";
let conversationSearchQuery = "";
let isConversationSearching = false;
let momentDraft = { type: "text", image: "", imageText: "" };
let contacts = [{ ...defaultContact }];
let groups = [];
let conversations = {
  ni: { contactId: "ni", messages: defaultMessages.map((message) => ({ ...message })) }
};
let moments = [
  {
    id: "moment-default",
    author: "Ni 小助手",
    text: "今天的小手机界面又长大了一点。",
    type: "text",
    image: "",
    imageText: "",
    likes: [],
    comments: [],
    time: "刚刚"
  }
];

function currentTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getContact(contactId) {
  return contacts.find((contact) => contact.id === contactId) || null;
}

function getGroup(groupId) {
  return groups.find((group) => group.id === groupId) || null;
}

function getChatMeta(conversationId) {
  const group = getGroup(conversationId);
  if (group) return group;
  return getContact(conversationId);
}

function getContactInitial(contact) {
  return (contact?.avatarText || contact?.name || "新").slice(0, 1);
}

function getConversationContactIds() {
  const directIds = contacts.filter((contact) => contact.chatEnabled && conversations[contact.id]).map((contact) => contact.id);
  const groupIds = groups.filter((group) => conversations[group.id]).map((group) => group.id);
  return [...directIds, ...groupIds];
}

function getConversationSubtitle() {
  return `${getConversationContactIds().length} 个聊天`;
}

function getContactsSubtitle() {
  return `${contacts.length} 位联系人`;
}

function createAvatarElement(contact, className = "list-avatar", fallback = "N") {
  const avatar = document.createElement("span");
  avatar.className = className;

  if (contact?.avatarImage) {
    const image = document.createElement("img");
    image.src = contact.avatarImage;
    image.alt = "";
    avatar.append(image);
    return avatar;
  }

  avatar.textContent = contact ? getContactInitial(contact) : fallback;
  return avatar;
}

function paintAvatar(target, contact, fallback = "N") {
  target.replaceChildren();
  target.textContent = "";

  if (contact?.avatarImage) {
    const image = document.createElement("img");
    image.src = contact.avatarImage;
    image.alt = "";
    target.append(image);
    return;
  }

  target.textContent = contact ? getContactInitial(contact) : fallback;
}

function saveContacts() {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function saveGroups() {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

function saveConversations() {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

function saveMoments() {
  localStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
}

function normalizeContact(contact, index) {
  const name = contact.name || "新联系人";
  return {
    id: contact.id || `contact-${index}`,
    name,
    note: contact.note || "",
    avatarText: contact.avatarText || name.slice(0, 1),
    avatarImage: contact.avatarImage || "",
    persona: contact.persona || "",
    pinned: Boolean(contact.pinned),
    chatEnabled: contact.chatEnabled === undefined ? contact.id === "ni" : Boolean(contact.chatEnabled)
  };
}

function restoreContacts() {
  const savedContacts = localStorage.getItem(CONTACTS_KEY);
  if (!savedContacts) {
    saveContacts();
    return;
  }

  try {
    const parsedContacts = JSON.parse(savedContacts);
    if (Array.isArray(parsedContacts) && parsedContacts.length) {
      contacts = parsedContacts.map(normalizeContact);
    }
  } catch {
    contacts = [{ ...defaultContact }];
  }
}

function normalizeGroup(group, index) {
  const name = group.name || "新群聊";
  return {
    id: group.id || `group-${index}`,
    name,
    avatarText: group.avatarText || "群",
    avatarImage: group.avatarImage || "",
    memberIds: Array.isArray(group.memberIds) ? group.memberIds.filter((id) => contacts.some((contact) => contact.id === id)) : []
  };
}

function restoreGroups() {
  const savedGroups = localStorage.getItem(GROUPS_KEY);
  if (!savedGroups) {
    saveGroups();
    return;
  }

  try {
    const parsedGroups = JSON.parse(savedGroups);
    if (Array.isArray(parsedGroups)) {
      groups = parsedGroups.map(normalizeGroup).filter((group) => group.memberIds.length >= 2);
    }
  } catch {
    groups = [];
  }
}

function restoreConversations() {
  const savedConversations = localStorage.getItem(CONVERSATIONS_KEY);
  if (savedConversations) {
    try {
      const parsedConversations = JSON.parse(savedConversations);
      if (parsedConversations && typeof parsedConversations === "object") {
        conversations = Object.fromEntries(
          Object.entries(parsedConversations)
            .filter(([, value]) => value && Array.isArray(value.messages))
            .map(([contactId, value]) => [
              contactId,
              {
                contactId,
                messages: value.messages
                  .filter((message) => message && typeof message.text === "string")
                  .map((message) => ({
                    type: message.type === "mine" ? "mine" : "other",
                    text: message.text,
                    time: message.time || currentTime()
                  }))
              }
            ])
        );
      }
    } catch {
    }
  } else {
    const savedMessages = localStorage.getItem(OLD_MESSAGES_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length) {
          conversations.ni = {
            contactId: "ni",
            messages: parsedMessages
              .filter((message) => message && typeof message.text === "string")
              .map((message) => ({
                type: message.type === "mine" ? "mine" : "other",
                text: message.text,
                time: message.time || currentTime()
              }))
          };
        }
      } catch {
      }
    }
  }

  if (!conversations.ni && contacts.some((contact) => contact.id === "ni")) {
    conversations.ni = { contactId: "ni", messages: defaultMessages.map((message) => ({ ...message })) };
  }

  Object.keys(conversations).forEach((contactId) => {
    const hasContact = contacts.some((contact) => contact.id === contactId);
    const hasGroup = groups.some((group) => group.id === contactId);
    if (!hasContact && !hasGroup) {
      delete conversations[contactId];
    }
  });

  saveConversations();
}

function restoreMoments() {
  const savedMoments = localStorage.getItem(MOMENTS_KEY);
  if (!savedMoments) {
    saveMoments();
    return;
  }

  try {
    const parsedMoments = JSON.parse(savedMoments);
    if (Array.isArray(parsedMoments)) {
      moments = parsedMoments
        .filter((moment) => moment && (moment.text || moment.image))
        .map((moment, index) => ({
          id: moment.id || `moment-${index}`,
          author: moment.author || "我",
          text: moment.text || "",
          type: moment.type || "text",
          image: moment.image || "",
          imageText: moment.imageText || moment.text || "",
          likes: Array.isArray(moment.likes) ? moment.likes : [],
          comments: Array.isArray(moment.comments) ? moment.comments.map((comment, commentIndex) => ({
            id: comment.id || `comment-${index}-${commentIndex}`,
            author: comment.author || "我",
            text: comment.text || "",
            replyTo: comment.replyTo || ""
          })) : [],
          time: moment.time || currentTime()
        }));
    }
  } catch {
  }
}

function ensureConversation(contactId) {
  const contact = getContact(contactId);
  const group = getGroup(contactId);
  if (!contact && !group) return null;

  if (contact) {
    contact.chatEnabled = true;
  }
  if (!conversations[contactId]) {
    conversations[contactId] = { contactId, messages: [] };
  }

  saveContacts();
  saveConversations();
  return conversations[contactId];
}

function setView(nextView) {
  homeView.classList.toggle("active", nextView === "home");
  chatView.classList.toggle("active", nextView === "chat");
  settingsView.classList.toggle("active", nextView === "settings");
  closeBearPopover();

  if (nextView === "chat") {
    setChatTab("dialog");
    showConversationList();
  }
}

function setTopDistance(value) {
  const numericValue = Math.min(Math.max(Number(value), TOP_DISTANCE_MIN), TOP_DISTANCE_MAX);
  const distance = `${numericValue}px`;
  phoneScreen.style.setProperty("--top-distance", distance);
  topDistanceValue.textContent = distance;
  topDistanceRange.value = numericValue;
  localStorage.setItem(TOP_DISTANCE_KEY, String(numericValue));
}

function restoreTopDistance() {
  const savedValue = Number(localStorage.getItem(TOP_DISTANCE_KEY));
  const fallbackValue = Number(topDistanceRange.value);
  const value = Number.isFinite(savedValue) ? savedValue : fallbackValue;
  setTopDistance(value);
}

function setPhoneStatusVisible(isVisible) {
  phoneScreen.classList.toggle("hide-phone-status", !isVisible);
  phoneStatusToggle.checked = isVisible;
  localStorage.setItem(PHONE_STATUS_KEY, isVisible ? "1" : "0");
}

function restorePhoneStatus() {
  setPhoneStatusVisible(localStorage.getItem(PHONE_STATUS_KEY) === "1");
}

function setAvatarVisibility(isVisible) {
  avatarToggle.checked = isVisible;
  chatView.classList.toggle("hide-avatars", !isVisible);
  localStorage.setItem(AVATAR_VISIBILITY_KEY, isVisible ? "1" : "0");
}

function restoreAvatarVisibility() {
  const savedValue = localStorage.getItem(AVATAR_VISIBILITY_KEY);
  setAvatarVisibility(savedValue === null ? true : savedValue === "1");
}

function setBearVisible(isVisible) {
  brandBear.classList.toggle("hidden", !isVisible);
  closeBearPopover();
  localStorage.setItem(BEAR_VISIBLE_KEY, isVisible ? "1" : "0");
}

function restoreBearVisibility() {
  setBearVisible(localStorage.getItem(BEAR_VISIBLE_KEY) !== "0");
}

function setBearPosition(xPercent, yPercent) {
  const x = Math.min(Math.max(xPercent, 14), 86);
  const y = Math.min(Math.max(yPercent, 13), 70);
  brandBear.style.setProperty("--bear-x", `${x}%`);
  brandBear.style.setProperty("--bear-y", `${y}%`);
  bearPopover.style.setProperty("--bear-x", `${x}%`);
  bearPopover.style.setProperty("--bear-y", `${y}%`);
  localStorage.setItem(BEAR_POSITION_KEY, JSON.stringify({ x, y }));
}

function restoreBearPosition() {
  const savedPosition = localStorage.getItem(BEAR_POSITION_KEY);
  if (!savedPosition) return;

  try {
    const { x, y } = JSON.parse(savedPosition);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      setBearPosition(x, y);
    }
  } catch {
  }
}

function moveBearToPointer(event) {
  const rect = phoneScreen.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  setBearPosition(x, y);
}

function openBearPopover() {
  if (brandBear.classList.contains("hidden")) return;
  bearPopover.classList.add("open");
  bearPopover.setAttribute("aria-hidden", "false");
}

function closeBearPopover() {
  bearPopover.classList.remove("open");
  bearPopover.setAttribute("aria-hidden", "true");
}

function openBearAddModal() {
  if (!brandBear.classList.contains("hidden")) return;
  bearAddModal.classList.add("open");
  bearAddModal.setAttribute("aria-hidden", "false");
}

function closeBearAddModal() {
  bearAddModal.classList.remove("open");
  bearAddModal.setAttribute("aria-hidden", "true");
}

function setChatTab(tabName) {
  Object.entries(chatTabPanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === tabName);
  });

  chatTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.chatTab === tabName);
  });

  const subtitleMap = {
    dialog: getConversationSubtitle(),
    contacts: getContactsSubtitle(),
    moments: `${moments.length} 条动态`,
    me: "个人主页"
  };
  chatHeaderTitle.textContent = {
    dialog: "对话",
    contacts: "联系人",
    moments: "朋友圈",
    me: "我的"
  }[tabName];
  chatHeaderSubtitle.textContent = subtitleMap[tabName];
  chatView.classList.toggle("dialog-open", tabName === "dialog");
  chatView.classList.toggle("contacts-open", tabName === "contacts");
  chatView.classList.toggle("moments-open", tabName === "moments");
  chatView.classList.remove("conversation-open");
  toolPanel.classList.remove("open");
  toolBtn.setAttribute("aria-expanded", "false");

  if (tabName === "dialog") {
    showConversationList();
  } else if (tabName === "contacts") {
    renderContacts();
  } else if (tabName === "moments") {
    renderMoments();
  }
}

function showConversationList() {
  conversationList.classList.add("active");
  conversationDetail.classList.remove("active");
  conversationSearch.parentElement.classList.remove("hidden");
  chatTabs.classList.remove("hidden");
  chatView.classList.add("dialog-open");
  chatView.classList.remove("conversation-open", "contacts-open", "moments-open");
  toolPanel.classList.remove("open");
  toolBtn.setAttribute("aria-expanded", "false");
  chatHeaderTitle.textContent = "对话";
  chatHeaderSubtitle.textContent = "";
  renderConversations();
}

function showConversationDetail(contactId = activeConversationId) {
  const conversation = ensureConversation(contactId);
  const chatMeta = getChatMeta(contactId);
  if (!conversation || !chatMeta) return;

  activeConversationId = contactId;
  conversationList.classList.remove("active");
  conversationDetail.classList.add("active");
  conversationSearch.parentElement.classList.add("hidden");
  chatTabs.classList.add("hidden");
  chatView.classList.add("conversation-open");
  chatView.classList.remove("dialog-open", "contacts-open", "moments-open");
  chatHeaderTitle.textContent = chatMeta.name;
  chatHeaderSubtitle.textContent = getGroup(contactId) ? `${getGroup(contactId).memberIds.length} 位成员` : (chatMeta.persona ? "已设置人设" : "在线");
  paintAvatar(headerAvatar, chatMeta, getGroup(contactId) ? "群" : "N");
  renderMessages(contactId);
  window.setTimeout(() => input.focus(), 230);
}

function renderConversations() {
  conversationList.replaceChildren();
  const allContactIds = getConversationContactIds();
  const query = conversationSearchQuery.trim().toLowerCase();
  if (isConversationSearching && !query) {
    return;
  }
  const contactIds = allContactIds.filter((contactId) => {
    const chatMeta = getChatMeta(contactId);
    const conversation = conversations[contactId];
    const messageText = (conversation?.messages || []).map((message) => message.text).join(" ");
    return !query || `${chatMeta?.name || ""} ${messageText}`.toLowerCase().includes(query);
  });

  if (!allContactIds.length) {
    const empty = document.createElement("article");
    empty.className = "moment-card";
    empty.innerHTML = "<strong>还没有对话</strong><p>去联系人里左滑联系人，点开启对话。</p>";
    conversationList.append(empty);
    return;
  }

  if (!contactIds.length) {
    const empty = document.createElement("article");
    empty.className = "moment-card";
    empty.innerHTML = "<strong>没有找到</strong><p>换一个名字或关键词试试。</p>";
    conversationList.append(empty);
    return;
  }

  contactIds.forEach((contactId) => {
    const chatMeta = getChatMeta(contactId);
    if (!chatMeta) return;
    const conversation = conversations[contactId];
    const latestMessage = conversation.messages[conversation.messages.length - 1];
    const item = document.createElement("button");
    item.className = "conversation-item";
    item.type = "button";
    item.setAttribute("aria-label", `打开 ${chatMeta.name}`);
    item.append(createAvatarElement(chatMeta, "list-avatar", getGroup(contactId) ? "群" : "N"));

    const copy = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = chatMeta.name;
    const preview = document.createElement("em");
    preview.textContent = latestMessage?.text || "还没有消息，点开开始聊天。";
    copy.append(name, preview);

    const time = document.createElement("time");
    time.textContent = latestMessage?.time || "";

    item.append(copy, time);
    item.addEventListener("click", () => {
      exitConversationSearch();
      showConversationDetail(contactId);
    });
    conversationList.append(item);
  });
}

function enterConversationSearch() {
  isConversationSearching = true;
  chatView.classList.add("searching");
  renderConversations();
}

function exitConversationSearch() {
  isConversationSearching = false;
  conversationSearchQuery = "";
  conversationSearch.value = "";
  chatView.classList.remove("searching");
  renderConversations();
}

function closeAllContactActions() {
  document.querySelectorAll(".contact-row.revealed").forEach((row) => row.classList.remove("revealed"));
}

function bindContactSwipe(row, card) {
  let startX = 0;
  let startY = 0;
  let movedX = 0;
  let isTracking = false;

  card.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    startY = event.clientY;
    movedX = 0;
    isTracking = true;
    card.classList.add("swiping");
  });

  card.addEventListener("pointermove", (event) => {
    if (!isTracking) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaY) > Math.abs(deltaX) + 12) return;

    movedX = Math.max(-204, Math.min(0, deltaX));
    card.style.transform = `translateX(${movedX}px)`;
  });

  function finishSwipe() {
    if (!isTracking) return;
    isTracking = false;
    card.classList.remove("swiping");
    card.style.transform = "";
    const shouldReveal = movedX < -46;
    if (shouldReveal) closeAllContactActions();
    row.classList.toggle("revealed", shouldReveal);
  }

  card.addEventListener("pointerup", finishSwipe);
  card.addEventListener("pointercancel", finishSwipe);
}

function renderContacts() {
  contactList.replaceChildren();

  contacts.forEach((contact) => {
    const row = document.createElement("article");
    row.className = "contact-row";

    const actions = document.createElement("div");
    actions.className = "contact-actions";

    const pinButton = document.createElement("button");
    pinButton.className = "contact-action pin";
    pinButton.type = "button";
    pinButton.textContent = "置顶";
    pinButton.addEventListener("click", () => pinContact(contact.id));

    const chatButton = document.createElement("button");
    chatButton.className = "contact-action chat";
    chatButton.type = "button";
    chatButton.textContent = "开启对话";
    chatButton.addEventListener("click", () => openChatForContact(contact.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "contact-action delete";
    deleteButton.type = "button";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => requestDeleteContact(contact.id));

    actions.append(pinButton, chatButton, deleteButton);

    const card = document.createElement("button");
    card.className = "contact-card";
    card.type = "button";
    card.append(createAvatarElement(contact));

    const copy = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = contact.name;
    copy.append(name);
    card.append(copy);
    card.addEventListener("click", () => {
      if (row.classList.contains("revealed")) {
        row.classList.remove("revealed");
        return;
      }
      openContactEditor(contact.id);
    });

    bindContactSwipe(row, card);
    row.append(actions, card);
    contactList.append(row);
  });

  chatHeaderSubtitle.textContent = chatTabPanels.contacts.classList.contains("active") ? getContactsSubtitle() : chatHeaderSubtitle.textContent;
}

function addContact() {
  const nextNumber = contacts.length + 1;
  const newContact = {
    id: makeId("contact"),
    name: `新联系人 ${nextNumber}`,
    note: "刚刚添加",
    avatarText: String(nextNumber),
    avatarImage: "",
    persona: "",
    pinned: false,
    chatEnabled: false
  };
  contacts.push(newContact);
  saveContacts();
  renderContacts();
  openContactEditor(newContact.id);
}

function pinContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index < 0) return;
  const [contact] = contacts.splice(index, 1);
  contact.pinned = true;
  contacts.unshift(contact);
  saveContacts();
  renderContacts();
}

function openChatForContact(contactId) {
  closeAllContactActions();
  ensureConversation(contactId);
  setChatTab("dialog");
  showConversationDetail(contactId);
}

function renderGroupMemberList() {
  groupMemberList.replaceChildren();

  contacts.forEach((contact) => {
    const label = document.createElement("label");
    label.className = "group-member";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = contact.id;

    const name = document.createElement("span");
    name.textContent = contact.name;

    label.append(checkbox, name);
    groupMemberList.append(label);
  });
}

function openGroupModal() {
  groupAvatarDraft = "";
  groupNameInput.value = "";
  groupHint.textContent = "至少选择两个联系人。";
  groupAvatarPreview.replaceChildren();
  groupAvatarPreview.textContent = "群";
  renderGroupMemberList();
  groupModal.classList.add("open");
  groupModal.setAttribute("aria-hidden", "false");
}

function closeGroupModal() {
  groupAvatarFileInput.value = "";
  groupModal.classList.remove("open");
  groupModal.setAttribute("aria-hidden", "true");
}

function saveGroup() {
  const memberIds = Array.from(groupMemberList.querySelectorAll("input:checked")).map((inputEl) => inputEl.value);
  if (memberIds.length < 2) {
    groupHint.textContent = "请至少选择两个联系人。";
    return;
  }

  const groupName = groupNameInput.value.trim() || "新群聊";
  const group = {
    id: makeId("group"),
    name: groupName,
    avatarText: "群",
    avatarImage: groupAvatarDraft,
    memberIds
  };
  groups.unshift(group);
  conversations[group.id] = { contactId: group.id, messages: [] };
  saveGroups();
  saveConversations();
  closeGroupModal();
  setChatTab("dialog");
  showConversationDetail(group.id);
}

function requestDeleteContact(contactId) {
  const contact = getContact(contactId);
  pendingDeleteAction = { type: "contact", id: contactId };
  deleteTitle.textContent = "删除联系人？";
  deleteMessage.textContent = `确认删除 ${contact?.name || "此联系人"} 吗？删除后会同时移除资料、单聊对话，以及相关群聊里的这个联系人。`;
  openDeleteModal();
}

function requestDeleteBear() {
  pendingDeleteAction = { type: "bear" };
  deleteTitle.textContent = "删除小熊？";
  deleteMessage.textContent = "删除后可以长按主界面背景再添加回来。";
  openDeleteModal();
}

function openDeleteModal() {
  deleteModal.classList.add("open");
  deleteModal.setAttribute("aria-hidden", "false");
}

function closeDeleteModal() {
  pendingDeleteAction = null;
  deleteModal.classList.remove("open");
  deleteModal.setAttribute("aria-hidden", "true");
}

function confirmDelete() {
  if (!pendingDeleteAction) return;

  if (pendingDeleteAction.type === "bear") {
    setBearVisible(false);
  }

  if (pendingDeleteAction.type === "contact") {
    const contactId = pendingDeleteAction.id;
    const removedConversationIds = new Set([contactId]);
    contacts = contacts.filter((contact) => contact.id !== contactId);
    delete conversations[contactId];
    groups = groups
      .map((group) => ({ ...group, memberIds: group.memberIds.filter((memberId) => memberId !== contactId) }))
      .filter((group) => {
        if (group.memberIds.length >= 2) return true;
        removedConversationIds.add(group.id);
        delete conversations[group.id];
        return false;
      });
    if (removedConversationIds.has(activeConversationId)) {
      activeConversationId = getConversationContactIds()[0] || "";
      showConversationList();
    }
    saveContacts();
    saveGroups();
    saveConversations();
    renderContacts();
    renderConversations();
  }

  closeDeleteModal();
}

function openContactEditor(contactId) {
  const contact = getContact(contactId);
  if (!contact) return;
  activeContactId = contactId;
  avatarDraft = contact.avatarImage || "";
  contactNameInput.value = contact.name;
  contactPersonaInput.value = contact.persona || "";
  updateEditAvatarPreview(contact);
  contactModal.classList.add("open");
  contactModal.setAttribute("aria-hidden", "false");
}

function updateEditAvatarPreview(contact) {
  paintAvatar(editAvatarPreview, contact, "新");
}

function closeContactEditor() {
  activeContactId = "";
  avatarDraft = "";
  avatarFileInput.value = "";
  contactModal.classList.remove("open");
  contactModal.setAttribute("aria-hidden", "true");
}

function saveContactEdits() {
  const contact = getContact(activeContactId);
  if (!contact) return;
  const nextName = contactNameInput.value.trim() || "新联系人";
  contact.name = nextName;
  contact.avatarText = nextName.slice(0, 1);
  contact.avatarImage = avatarDraft;
  contact.persona = contactPersonaInput.value.trim();
  contact.note = contact.persona ? "" : contact.note;
  saveContacts();
  renderContacts();
  renderConversations();
  if (activeConversationId === contact.id && conversationDetail.classList.contains("active")) {
    showConversationDetail(contact.id);
  }
  closeContactEditor();
}

function scrollMessages() {
  messages.scrollTop = messages.scrollHeight;
}

function createMessageElement(message, contact) {
  const item = document.createElement("article");
  item.className = `message ${message.type}`;

  const avatar = message.type === "mine"
    ? createAvatarElement(null, "message-avatar", "我")
    : createAvatarElement(contact, "message-avatar", "N");
  avatar.setAttribute("aria-hidden", "true");

  const bubble = document.createElement("p");
  bubble.textContent = message.text;

  const time = document.createElement("time");
  time.textContent = message.time;

  item.append(avatar, bubble, time);
  return item;
}

function renderMessages(contactId = activeConversationId) {
  const contact = getContact(contactId);
  const conversation = conversations[contactId] || { messages: [] };
  messages.replaceChildren();
  conversation.messages.forEach((message) => {
    messages.append(createMessageElement(message, contact));
  });
  scrollMessages();
}

function addMessage(text, type, contactId = activeConversationId) {
  const conversation = ensureConversation(contactId);
  if (!conversation) return;
  const message = { type, text, time: currentTime() };
  conversation.messages.push(message);
  saveConversations();
  messages.append(createMessageElement(message, getContact(contactId)));
  renderConversations();
  scrollMessages();
}

function replyToMessage(contactId) {
  const reply = replies[Math.floor(Math.random() * replies.length)];
  window.setTimeout(() => addMessage(reply, "other", contactId), 520);
}

function toggleMomentLike(momentId, actor) {
  const moment = moments.find((item) => item.id === momentId);
  if (!moment) return;
  moment.likes = Array.isArray(moment.likes) ? moment.likes : [];
  if (moment.likes.includes(actor)) {
    moment.likes = moment.likes.filter((name) => name !== actor);
  } else {
    moment.likes.push(actor);
  }
  saveMoments();
  renderMoments();
}

function addMomentComment(momentId, actor, text, replyTo = "") {
  const moment = moments.find((item) => item.id === momentId);
  if (!moment || !text.trim()) return;
  moment.comments = Array.isArray(moment.comments) ? moment.comments : [];
  moment.comments.push({
    id: makeId("comment"),
    author: actor,
    text: text.trim(),
    replyTo
  });
  saveMoments();
  renderMoments();
}

function renderMoments() {
  momentsList.replaceChildren();
  moments.forEach((moment) => {
    const viewerName = "我";
    const item = document.createElement("article");
    item.className = "moment-card";

    const author = document.createElement("strong");
    author.textContent = moment.author || "我";
    item.append(author);

    if (moment.text && moment.type !== "text-image") {
      const text = document.createElement("p");
      text.textContent = moment.text;
      item.append(text);
    }

    if (moment.type === "image" && moment.image) {
      const wrapper = document.createElement("div");
      wrapper.className = "moment-image";
      const image = document.createElement("img");
      image.src = moment.image;
      image.alt = "";
      wrapper.append(image);
      item.append(wrapper);
    }

    if (moment.type === "text-image") {
      const textImage = document.createElement("div");
      textImage.className = "moment-text-image";
      textImage.textContent = moment.imageText || moment.text || "文字图片";
      item.append(textImage);
    }

    const time = document.createElement("time");
    time.textContent = moment.time;
    item.append(time);

    const actions = document.createElement("div");
    actions.className = "moment-actions";

    const actorRow = document.createElement("div");
    actorRow.className = "moment-action-row";
    const spacer = document.createElement("span");
    spacer.className = "moment-action-spacer";
    const likeButton = document.createElement("button");
    likeButton.className = "moment-heart-button";
    likeButton.type = "button";
    likeButton.setAttribute("aria-label", moment.likes?.includes(viewerName) ? "取消喜欢" : "喜欢");
    likeButton.textContent = moment.likes?.includes(viewerName) ? "♥" : "♡";
    likeButton.addEventListener("click", () => toggleMomentLike(moment.id, viewerName));
    const commentButton = document.createElement("button");
    commentButton.className = "moment-action-button light";
    commentButton.type = "button";
    commentButton.textContent = "评论";
    actorRow.append(spacer, likeButton, commentButton);

    const likes = document.createElement("div");
    likes.className = "moment-likes";
    if (moment.likes?.length) {
      likes.textContent = `喜欢：${moment.likes.join("、")}`;
    }

    const comments = document.createElement("div");
    comments.className = "moment-comments";
    (moment.comments || []).forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.className = "moment-comment";
      const author = document.createElement("strong");
      author.textContent = comment.replyTo ? `${comment.author} 回复 ${comment.replyTo}` : comment.author;
      const text = document.createTextNode(comment.text);
      const replyButton = document.createElement("button");
      replyButton.type = "button";
      replyButton.textContent = "回复";
      function beginReply() {
        commentInput.dataset.replyTo = comment.author;
        commentInput.placeholder = `回复 ${comment.author}`;
        commentInput.focus();
      }
      replyButton.addEventListener("click", beginReply);
      commentItem.addEventListener("click", beginReply);
      commentItem.tabIndex = 0;
      commentItem.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          beginReply();
        }
      });
      commentItem.append(author, text, replyButton);
      comments.append(commentItem);
    });

    const inputRow = document.createElement("div");
    inputRow.className = "moment-action-row";
    const commentInput = document.createElement("input");
    commentInput.className = "moment-comment-input";
    commentInput.type = "text";
    commentInput.placeholder = "写评论";
    const sendCommentButton = document.createElement("button");
    sendCommentButton.className = "moment-action-button";
    sendCommentButton.type = "button";
    sendCommentButton.textContent = "发送";
    sendCommentButton.addEventListener("click", () => {
      addMomentComment(moment.id, viewerName, commentInput.value, commentInput.dataset.replyTo || "");
    });
    commentButton.addEventListener("click", () => {
      commentInput.dataset.replyTo = "";
      commentInput.placeholder = "写评论";
      commentInput.focus();
    });
    inputRow.append(commentInput, sendCommentButton);

    actions.append(actorRow, likes, comments, inputRow);
    item.append(actions);
    momentsList.append(item);
  });

  if (chatTabPanels.moments.classList.contains("active")) {
    chatHeaderSubtitle.textContent = `${moments.length} 条动态`;
  }
}

function openMomentModal() {
  momentDraft = { type: "text", image: "", imageText: "" };
  momentTextInput.value = "";
  renderMomentPreview();
  cameraOptions.classList.remove("open");
  momentModal.classList.add("open");
  momentModal.setAttribute("aria-hidden", "false");
}

function closeMomentModal() {
  momentImageInput.value = "";
  cameraOptions.classList.remove("open");
  momentModal.classList.remove("open");
  momentModal.setAttribute("aria-hidden", "true");
}

function renderMomentPreview() {
  momentPreview.replaceChildren();
  momentPreview.className = "moment-preview";
  momentPreview.setAttribute("aria-hidden", "true");

  if (momentDraft.type === "image" && momentDraft.image) {
    momentPreview.classList.add("active");
    const image = document.createElement("img");
    image.src = momentDraft.image;
    image.alt = "";
    momentPreview.append(image);
    momentPreview.setAttribute("aria-hidden", "false");
  }

  if (momentDraft.type === "text-image") {
    momentPreview.classList.add("active", "text-image");
    const editor = document.createElement("div");
    editor.className = "text-image-editor";
    editor.contentEditable = "true";
    editor.textContent = momentDraft.imageText || "点这里编辑文字图片";
    editor.addEventListener("input", () => {
      momentDraft.imageText = editor.textContent.trim();
    });
    momentPreview.append(editor);
    momentPreview.setAttribute("aria-hidden", "false");
  }
}

function publishMoment() {
  const text = momentTextInput.value.trim();
  const imageText = momentDraft.imageText || "";
  if (!text && !momentDraft.image && !imageText) return;

  moments.unshift({
    id: makeId("moment"),
    author: "我",
    text,
    type: momentDraft.type,
    image: momentDraft.image,
    imageText,
    likes: [],
    comments: [],
    time: currentTime()
  });
  saveMoments();
  renderMoments();
  closeMomentModal();
}

function updateClock() {
  clock.textContent = currentTime();
}

brandBear.addEventListener("pointerdown", (event) => {
  if (!homeView.classList.contains("active") || brandBear.classList.contains("hidden")) return;

  brandBear.setPointerCapture(event.pointerId);
  bearLongPressTimer = window.setTimeout(() => {
    isDraggingBear = true;
    closeBearPopover();
    brandBear.classList.add("dragging");
    moveBearToPointer(event);
  }, 360);
});

brandBear.addEventListener("pointermove", (event) => {
  if (!isDraggingBear) return;
  moveBearToPointer(event);
});

function stopBearDrag(event) {
  window.clearTimeout(bearLongPressTimer);
  if (!isDraggingBear && event?.type === "pointerup") {
    const now = Date.now();
    if (now - lastBearTapAt < 340) {
      openBearPopover();
      lastBearTapAt = 0;
    } else {
      lastBearTapAt = now;
    }
  }
  isDraggingBear = false;
  brandBear.classList.remove("dragging");
}

brandBear.addEventListener("pointerup", stopBearDrag);
brandBear.addEventListener("pointercancel", stopBearDrag);
brandBear.addEventListener("dblclick", (event) => {
  event.preventDefault();
  window.clearTimeout(bearLongPressTimer);
  if (!isDraggingBear) openBearPopover();
});

function startWallpaperLongPress(event) {
  if (!homeView.classList.contains("active")) return;
  if (!brandBear.classList.contains("hidden")) return;
  if (event.target.closest("button") || event.target.closest(".dock") || event.target.closest(".modal-overlay")) return;

  wallpaperLongPressTimer = window.setTimeout(openBearAddModal, 540);
}

function cancelWallpaperLongPress() {
  window.clearTimeout(wallpaperLongPressTimer);
}

homeView.addEventListener("pointerdown", startWallpaperLongPress);
homeView.addEventListener("pointerup", cancelWallpaperLongPress);
homeView.addEventListener("pointercancel", cancelWallpaperLongPress);

deleteBearBtn.addEventListener("click", requestDeleteBear);
cancelAddBearBtn.addEventListener("click", closeBearAddModal);
confirmAddBearBtn.addEventListener("click", () => {
  setBearVisible(true);
  closeBearAddModal();
});

openChatButtons.forEach((button) => {
  button.addEventListener("click", () => setView("chat"));
});

openSettingsBtn.addEventListener("click", () => setView("settings"));
addContactBtn.addEventListener("click", addContact);
addMomentBtn.addEventListener("click", openMomentModal);
addGroupBtn.addEventListener("click", openGroupModal);
closeContactModal.addEventListener("click", closeContactEditor);
saveContactBtn.addEventListener("click", saveContactEdits);

avatarEditor.addEventListener("click", () => {
  avatarFileInput.click();
});

avatarFileInput.addEventListener("change", () => {
  const [file] = avatarFileInput.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    avatarDraft = String(reader.result);
    updateEditAvatarPreview({
      name: contactNameInput.value || "新",
      avatarText: (contactNameInput.value || "新").slice(0, 1),
      avatarImage: avatarDraft
    });
  });
  reader.readAsDataURL(file);
});

closeGroupModalBtn.addEventListener("click", closeGroupModal);
groupAvatarEditor.addEventListener("click", () => {
  groupAvatarFileInput.click();
});
groupAvatarFileInput.addEventListener("change", () => {
  const [file] = groupAvatarFileInput.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    groupAvatarDraft = String(reader.result);
    groupAvatarPreview.replaceChildren();
    const image = document.createElement("img");
    image.src = groupAvatarDraft;
    image.alt = "";
    groupAvatarPreview.append(image);
  });
  reader.readAsDataURL(file);
});
saveGroupBtn.addEventListener("click", saveGroup);

cancelDeleteBtn.addEventListener("click", closeDeleteModal);
confirmDeleteBtn.addEventListener("click", confirmDelete);

chatTabButtons.forEach((button) => {
  button.addEventListener("click", () => setChatTab(button.dataset.chatTab));
});

backBtn.addEventListener("click", () => {
  if (conversationDetail.classList.contains("active")) {
    showConversationList();
    return;
  }
  setView("home");
});

settingsBackBtn.addEventListener("click", () => setView("home"));

toolBtn.addEventListener("click", () => {
  const isOpen = toolPanel.classList.toggle("open");
  toolBtn.setAttribute("aria-expanded", String(isOpen));
});

avatarToggle.addEventListener("change", () => {
  setAvatarVisibility(avatarToggle.checked);
});

conversationSearch.addEventListener("input", () => {
  conversationSearchQuery = conversationSearch.value;
  renderConversations();
});

conversationSearch.addEventListener("focus", enterConversationSearch);

conversationSearch.addEventListener("search", () => {
  if (!conversationSearch.value.trim()) {
    exitConversationSearch();
  }
});

conversationSearch.addEventListener("blur", () => {
  window.setTimeout(() => {
    if (!conversationSearch.value.trim() && !conversationSearch.matches(":focus")) {
      exitConversationSearch();
    }
  }, 120);
});

topDistanceRange.addEventListener("input", () => {
  setTopDistance(topDistanceRange.value);
});

phoneStatusToggle.addEventListener("change", () => {
  setPhoneStatusVisible(phoneStatusToggle.checked);
});

closeMomentModalBtn.addEventListener("click", closeMomentModal);
momentCameraBtn.addEventListener("click", () => {
  cameraOptions.classList.toggle("open");
});
uploadMomentImageBtn.addEventListener("click", () => {
  cameraOptions.classList.remove("open");
  momentImageInput.click();
});
useTextImageBtn.addEventListener("click", () => {
  momentDraft = { type: "text-image", image: "", imageText: momentDraft.imageText || "点这里编辑文字图片" };
  cameraOptions.classList.remove("open");
  renderMomentPreview();
});
momentImageInput.addEventListener("change", () => {
  const [file] = momentImageInput.files;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    momentDraft = { type: "image", image: String(reader.result), imageText: "" };
    renderMomentPreview();
  });
  reader.readAsDataURL(file);
});
publishMomentBtn.addEventListener("click", publishMoment);

document.addEventListener("click", (event) => {
  if (bearPopover.classList.contains("open") && !bearPopover.contains(event.target) && !brandBear.contains(event.target)) {
    closeBearPopover();
  }

  if (contactModal.classList.contains("open") && event.target === contactModal) {
    closeContactEditor();
  }

  if (deleteModal.classList.contains("open") && event.target === deleteModal) {
    closeDeleteModal();
  }

  if (bearAddModal.classList.contains("open") && event.target === bearAddModal) {
    closeBearAddModal();
  }

  if (momentModal.classList.contains("open") && event.target === momentModal) {
    closeMomentModal();
  }

  if (groupModal.classList.contains("open") && event.target === groupModal) {
    closeGroupModal();
  }

  if (cameraOptions.classList.contains("open") && !cameraOptions.contains(event.target) && !momentCameraBtn.contains(event.target)) {
    cameraOptions.classList.remove("open");
  }

  if (!toolPanel.classList.contains("open")) return;
  if (toolPanel.contains(event.target) || toolBtn.contains(event.target)) return;

  toolPanel.classList.remove("open");
  toolBtn.setAttribute("aria-expanded", "false");
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || !activeConversationId) return;

  const replyContactId = activeConversationId;
  addMessage(text, "mine", replyContactId);
  input.value = "";
  replyToMessage(replyContactId);
});

updateClock();
restoreContacts();
restoreGroups();
restoreConversations();
restoreMoments();
restoreTopDistance();
restorePhoneStatus();
restoreAvatarVisibility();
restoreBearPosition();
restoreBearVisibility();
renderContacts();
renderConversations();
renderMoments();
window.setInterval(updateClock, 30_000);
