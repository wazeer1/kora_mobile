import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLazySearchUsersQuery } from '@/src/store/api/usersApi';
import React, { useEffect, useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

interface User {
    id: string;
    name: string;
    username: string;
    avatar?: string;
}

interface UserPickerProps {
    value: User | null;
    onSelect: (user: User | null) => void;
    placeholder?: string;
    label?: string;
}

const Container = styled.View`
  margin-bottom: 16px;
`;

const Label = styled(ThemedText)`
  font-size: 12px;
  color: #B0B3B8;
  margin-bottom: 8px;
`;

const SearchInput = styled(TextInput)`
  background-color: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 12px;
  color: white;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const ResultItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #0A192F;
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);
`;

const SelectedContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(78, 205, 196, 0.1);
  border-radius: 8px;
  padding: 12px;
  border-width: 1px;
  border-color: #4ECDC4;
`;

const Avatar = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #333;
`;

export const UserPicker = ({ value, onSelect, placeholder = "Search user...", label }: UserPickerProps) => {
    const [query, setQuery] = useState('');
    const [triggerSearch, { data: searchResults, isFetching }] = useLazySearchUsersQuery();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 2) {
                triggerSearch(query);
            }
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [query]);
    console.log(searchResults?.data?.pagination?.page, "searchResults");
    const users = searchResults?.data?.pagination?.page?.map((u: any) => ({
        id: u.id,
        name: u.handle || u.username || 'Unknown',
        username: u.email || '', // or handle
        avatar: u.avatar_url,
    })) || [];
    console.log(users, "_____");

    const handleSearch = (text: string) => {
        setQuery(text);
    };

    const handleSelect = (user: User) => {
        onSelect(user);
        setQuery('');
    };

    const handleClear = () => {
        onSelect(null);
    };

    if (value) {
        return (
            <Container>
                {label && <Label>{label}</Label>}
                <SelectedContainer>
                    {value.avatar && <Avatar source={{ uri: value.avatar }} />}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <ThemedText style={{ fontWeight: 'bold' }}>{value.name}</ThemedText>
                        <ThemedText style={{ fontSize: 12, color: '#4ECDC4' }}>{value.username}</ThemedText>
                    </View>
                    <IconSymbol name="checkmark.circle.fill" size={24} color="#4ECDC4" />
                    <TouchableOpacity onPress={handleClear} style={{ marginLeft: 12 }}>
                        <IconSymbol name="xmark" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                </SelectedContainer>
            </Container>
        );
    }

    return (
        <Container>
            {label && <Label>{label}</Label>}
            <SearchInput
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={query}
                onChangeText={handleSearch}
            />
            {query.length > 2 && (
                <View style={{ marginTop: 4, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#333' }}>
                    {isFetching ? (
                        <View style={{ padding: 12, alignItems: 'center' }}>
                            <ThemedText style={{ color: '#888' }}>Searching...</ThemedText>
                        </View>
                    ) : users.length > 0 ? (
                        users.map((user: User) => (
                            <ResultItem key={user.id} onPress={() => handleSelect(user)}>
                                {user.avatar && <Avatar source={{ uri: user.avatar }} />}
                                <View style={{ marginLeft: 12 }}>
                                    <ThemedText>{user.name}</ThemedText>
                                    <ThemedText style={{ fontSize: 12, color: '#B0B3B8' }}>{user.username}</ThemedText>
                                </View>
                            </ResultItem>
                        ))
                    ) : (
                        <View style={{ padding: 12, alignItems: 'center' }}>
                            <ThemedText style={{ color: '#888' }}>No users found.</ThemedText>
                        </View>
                    )}
                </View>
            )}
        </Container>
    );
};
