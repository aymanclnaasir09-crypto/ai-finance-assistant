import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Send, Sparkles, Bot, Receipt, BarChart3 } from "lucide-react-native";
import { useAI } from "../../context/AiContext";

// Normalize AI markdown-style responses for clean display
const formatMessageText = (text) => {
  if (!text) return "";

  let cleaned = text;
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1"); // strip bold
  cleaned = cleaned.replace(/\*(.*?)\*/g, "$1"); // strip italics / bullet markers
  cleaned = cleaned.replace(/^\s*[-*]\s+/gm, "• "); // bullets to dots

  return cleaned.trim();
};

const AIHubScreen = () => {
  const [message, setMessage] = useState("");
  const { chatHistory, isTyping, sendMessage } = useAI();
  const flatListRef = useRef(null);
  
  

  const handleSend = () => {
    if (message.trim().length === 0) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-blue-600 p-2 rounded-xl mr-3">
            <Sparkles size={20} color="white" />
          </View>
          <View>
            <Text className="text-xl font-bold text-slate-900">
              AI Assistant
            </Text>
            <Text className="text-emerald-500 text-xs font-medium">Online</Text>
          </View>
        </View>
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={chatHistory}
        keyExtractor={(item, index) => index}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        // 1. FIXED: Static Welcome Message (Not sent to API)
        ListHeaderComponent={() => (
          <View>
            <View className="mb-6 flex-row justify-start">
              <View className="bg-slate-200 p-2 rounded-full self-end mr-2">
                <Bot size={16} color="#475569" />
              </View>
              <View className="max-w-[80%] p-4 rounded-3xl bg-white border border-slate-100 rounded-bl-none shadow-sm">
                <Text className="text-sm text-slate-800">
                  Hi! I’m your financial assistant. How can I help you save
                  today?
                </Text>
              </View>
            </View>

            {/* Quick Actions Pills */}
            <View className="flex-row mb-6">
              <TouchableOpacity
                className="bg-white border border-slate-200 px-4 py-2 rounded-full flex-row items-center shadow-sm"
                onPress={() => sendMessage("Give me saving tips on budgeting.")}
              >
                <BarChart3 size={14} color="#2563eb" />
                <Text className="ml-2 text-xs font-semibold text-slate-600">
                  Budget Advice
                </Text>
              </TouchableOpacity>
                  
            </View>
          </View>
        )}
        // Loading Indicator at bottom
        ListFooterComponent={() =>
          isTyping ? (
            <View className="flex-row justify-start mb-6">
              <View className="bg-slate-200 p-2 rounded-full self-end mr-2">
                <Bot size={16} color="#475569" />
              </View>
              <View className="bg-white border border-slate-100 p-4 rounded-3xl rounded-bl-none shadow-sm">
                <ActivityIndicator size="small" color="#2563eb" />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            className={`mb-6 flex-row ${
              item.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {item.role === "assistant" && (
              <View className="bg-slate-200 p-2 rounded-full self-end mr-2">
                <Bot size={16} color="#475569" />
              </View>
            )}

            <View
              className={`max-w-[80%] p-4 rounded-3xl ${
                item.role === "user"
                  ? "bg-blue-600 rounded-br-none"
                  : "bg-white border border-slate-100 rounded-bl-none shadow-sm"
              }`}
            >
              <Text
                className={`text-sm ${
                  item.role === "user" ? "text-white" : "text-slate-800"
                }`}
              >
                {formatMessageText(item.text)}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View className="p-4 bg-white border-t border-slate-100 flex-row items-center">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ask AI about your finances..."
            className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-2xl mr-2 text-slate-900"
            multiline
            editable={!isTyping}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={isTyping || message.trim().length === 0}
            className={`p-3 rounded-xl ${
              message.length > 0 && !isTyping ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AIHubScreen;
