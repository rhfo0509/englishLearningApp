import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Language {
  code: string;
  label: string;
}

const LanguageButton = () => {
  const [visible, setVisible] = useState(false);

  const languages: Language[] = [
    {code: 'ko', label: '한국어'},
    {code: 'ja', label: '日本語'},
    {code: 'zh', label: '中文 (普通话)'},
    {code: 'zh-TW', label: '中文 (繁體)'},
    {code: 'id', label: 'Bahasa Indonesia'},
    {code: 'ms', label: 'Bahasa Melayu'},
    {code: 'vn', label: 'Tiếng Việt'},
    {code: 'ru', label: 'Русский'},
    {code: 'es', label: 'Español'},
    {code: 'pt', label: 'Português'},
  ];

  const toggleModal = () => {
    setVisible(!visible);
  };

  const renderLanguageItem = ({item}: {item: Language}) => (
    <TouchableOpacity>
      <Text style={styles.languageItem}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={styles.languageButton} onPress={toggleModal}>
        <Icon name="language" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={item => item.code}
            />
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    marginTop: 4,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  languageItem: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1d6cb9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LanguageButton;
