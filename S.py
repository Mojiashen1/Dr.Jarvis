# -*- coding: utf-8 -*-
"""
Created on Fri Sep  9 21:44:08 2016

@author: praneetdutta
"""
def pdreturnclass(s):
 import re
 import pandas as pd
 import csv
 import nltk
 
#start process_tweet
 def processTweet(content):
    # process the tweets
    
    content=content.lower()
    #Convert to lower case
    
    #Convert www.* or https?://* to URL
    content = re.sub('((www\.[^\s]+)|(https?://[^\s]+))','URL',content)
    #Convert @username to AT_USER
    content = re.sub('@[^\s]+','AT_USER',content)
    #Remove additional white spaces
    content = re.sub('[\s]+', ' ', content)
    #Replace #word with word
    content = re.sub(r'#([^\s]+)', r'\1', content)
    #trim
    content = content.strip('\'"')
    return content
#end
 

#initialize stopWords
 stopWords = []

 #start replaceTwoOrMore
 def replaceTwoOrMore(s):  
    #look for 2 or more repetitions of character and replace with the character itself
    pattern = re.compile(r"(.)\1{1,}", re.DOTALL)
    return pattern.sub(r"\1\1", s)
 #end

 #start getStopWordList
 def getStopWordList(stopWordListFileName):
    #read the stopwords file and build a list
    stopWords = []
    stopWords.append('AT_USER')
    stopWords.append('URL')

    fp = open(stopWordListFileName, 'r')
    line = fp.readline()
    while line:
        word = line.strip()
        stopWords.append(word)
        line = fp.readline()
    fp.close()
    return stopWords
 #end

#start getfeatureVector
 def getFeatureVector(tweet):
    featureVector = []
    #split tweet into words
    words = tweet.split()
    for w in words:
        #replace two or more with two occurrences
        w = replaceTwoOrMore(w)
        #strip punctuation
        w = w.strip('\'"?,.')
        #check if the word stats with an alphabet
        val = re.search(r"^[a-zA-Z][a-zA-Z0-9]*$", w)
        #ignore if it is a stop word
        if(w in stopWords or val is None):
            continue
        else:
            featureVector.append(w.lower())
    return featureVector
 #end



#start extract_features  
 def extract_features(tweet):
    tweet_words = set(tweet)
    features = {}
    for word in featureList:
        features['contains(%s)' % word] = (word in tweet_words)
    return features
 #end
 #Read the tweets one by one and process it 
 inpTweets = pd.read_csv('testdata11.csv')
 #print "hi"
 stopWords = getStopWordList('stopwords.txt') 





 featureList = []
 tweetss=inpTweets['Symptoms']
 sentiments=inpTweets['Disease']

 testinput=s

 processedTestTweet = processTweet(testinput) 
 #print "BYEEEEEEEE"
 #print "FALGTESSSSSST"

 ii=0
 tweets = []
 finaltweets=[]
 for row in tweetss:
    sentiment = sentiments[ii]
    tweet = row
    ii+=1
    processedTweet = processTweet(tweet)
    finaltweets.append((processedTweet,sentiment))
    featureVector = getFeatureVector(processedTweet)
    featureList.extend(featureVector)
    tweets.append((featureVector, sentiment));

 training_set = nltk.classify.util.apply_features(extract_features, tweets)


 NBClassifier = nltk.NaiveBayesClassifier.train(training_set)
 sentiment=NBClassifier.classify(extract_features(getFeatureVector(processedTestTweet)))
 
 if(sentiment=='H'):
     return "Heart Disease"
 if(sentiment=="C"):
     return "Catarct Disease"
 if(sentiment=="N"):
     return "No Disease"
     
 return sentiment


"EXAMPLE TEST"
print pdreturnclass("My heart hurts")
