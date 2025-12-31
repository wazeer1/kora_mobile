import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import styled from 'styled-components/native';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 2px;
  overflow: hidden;
`;

const Header = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: rgba(10, 25, 47, 0.5);
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.05);
`;

const Content = styled.View`
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.2);
`;

const Title = styled(ThemedText)`
  font-size: 16px;
  font-weight: 600;
  color: #D4AF37;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const Accordion = ({ title, children, defaultExpanded = false }: AccordionProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <Container>
            <Header onPress={toggleExpand} activeOpacity={0.7}>
                <Title>{title}</Title>
                <IconSymbol
                    name={expanded ? "chevron.up" : "chevron.down"}
                    size={20}
                    color="#D4AF37"
                />
            </Header>
            {expanded && <Content>{children}</Content>}
        </Container>
    );
};
