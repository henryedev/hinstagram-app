import React, { useState } from "react";
import { Image, Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { withNavigation } from "react-navigation";
import constants from "../constants";
import styles from "../styles";

const TOGGLE_LIKE = gql`
    mutation toggleLike($postId: String!) {
        toggleLike(postId: $postId)
    }
`;

const Container = styled.View`
    flex: 1;
`;

const Header = styled.View`
    padding: 15px;
    flex-direction: row;
    align-items: center;
`;

const Touchable = styled.TouchableOpacity``;

const HeaderUserContainer = styled.View`
    margin-left: 10;
    justify-content: center;
    align-items: center;
`;
const Bold = styled.Text`
    font-weight: 500;
`;

const Location = styled.Text`
    font-size: 12px;
`;

const IconsContainer = styled.View`
    flex-direction: row;
    margin-bottom: 5px;
`;
const IconContainer = styled.View`
    margin-right: 10px;
`;
const InfoContainer = styled.View`
    padding: 10px;
`;
const Caption = styled.Text`
    margin-top: 3px;
`;

const CommentCount = styled.Text`
    margin-top: 3px;
    opacity: 0.5;
    font-size: 13px;
`;

const Post = ({ 
    id, 
    user, 
    location, 
    files = [], 
    likeCount: likeCountProp, 
    caption, 
    comments = [], 
    isLiked: isLikedProp,
    navigation 
}) => {
    const[ isLiked, setIsLiked ] = useState(isLikedProp);
    const[ likeCount, setLikeCount ] = useState(likeCountProp);
    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
        variables: {
            postId: id 
        }
    });
    const handleLike = async() => {
        if(isLiked === true) {
            setLikeCount(l => l-1);
        } else {
            setLikeCount(l => l+1);
        }
        setIsLiked(p => !p);
        try {
            await toggleLikeMutation();
        } catch (e) { }
    };
    return (
        <Container>
            <Header>
                <Touchable onPress={() => navigation.navigate("UserDetail", {userName: user.userName})}>
                    <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={{ uri: user.avatar }} />
                </Touchable>
                <Touchable onPress={() => navigation.navigate("UserDetail", {userName: user.userName})}>
                    <HeaderUserContainer>
                        <Bold>{user.userName}</Bold>
                        <Location>{location}</Location>
                    </HeaderUserContainer>
                </Touchable>
            </Header>
            <Swiper showsPagination={false} style={{ height: constants.height / 2.5 }}>
                {files.map(file => (
                    <Image
                        style={{ width: constants.width, height: constants.height / 2.5 }}
                        key={file.id}
                        source={{ uri: file.url }} />
                ))}
            </Swiper>
            <InfoContainer>
                <IconsContainer>
                    <Touchable onPress={handleLike} >
                        <IconContainer>
                            <Ionicons size={28} color={isLiked ? styles.redColor : styles.blackColor} name={Platform.OS === "ios" ? isLiked ? "ios-heart" : "ios-heart-empty" : isLiked ? "md-heart" : "md-heart-empty"} />
                        </IconContainer>
                    </Touchable>
                    <Touchable>
                        <IconContainer>
                            <Ionicons size={28} color={styles.blackColor} name={Platform.OS === "ios" ? "ios-text" : "md-text"} />
                        </IconContainer>
                    </Touchable>
                </IconsContainer>
                <Touchable>
                    <Bold>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Bold>
                </Touchable>
                    <Caption>
                        <Bold>{user.userName}</Bold> {caption}
                    </Caption>
                    <Touchable>
                        <CommentCount>See all {comments.length} comments</CommentCount>                
                    </Touchable>
            </InfoContainer>
        </Container>
    );
};

Post.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        userName: PropTypes.string.isRequired
    }).isRequired,
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    likeCount: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                avatar: PropTypes.string,
                userName: PropTypes.string.isRequired
            }).isRequired
        })
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    location: PropTypes.string
};

export default withNavigation(Post);