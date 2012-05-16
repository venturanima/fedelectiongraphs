#!/usr/bin/python
"""
CS194-16 Data Science Assignment 1
UC Berkeley

Stephen Li
s.li@berkeley.edu

"""

from __future__ import division
import math
import sys

import numpy as np
from pandas import *


def add_party_column(df):
    """Add a column representing the candidate's party to the data frame.

    Args:
        df: A DataFrame generated from the campaign finance data csv file.

    Returns:
        A DataFrame based on df with an additional column keyed "party" whose
        values represent the party of the candidates.
        For Democratic candidates, use value "Democrat".
        For Republicans, use "Republican".
        For Libertarian candidates, use value "Libertarian".
    """
    party = []
    for id in df['cand_id']:
        #republican
        if id in ['P20002978', 'P80003353', 'P20002523', 'P20002556', 'P80000748', 'P20002721', 'P00003608', 'P60003654', 'P20003109', 'P20003067', 'P20003281']:
            party.append('Republican')
        #democrat
        elif id in ['P80003338']:
            party.append('Democrat')
        #libertarian
        elif id in ['P20002671']:
            party.append('Libertarian')
    df['party'] = party
    return df


def num_donation_records(df):
    """Return the total number of donation records.
    
    Args:
        df: A DataFrame generated from the campaign finance data csv file.

    Returns:
        An integer count of the number of donation records.
    """
    # count = 0
    # for record in df['contb_receipt_amt']:
        # count += 1
    # return count
    return len(df)


def num_refund_records(df):
    """Return the number of refund records.
    
    Args:
        df: A DataFrame generated from the campaign finance data csv file.

    Returns:
        An integer count of the number of refund records.
    """
    count = 0
    for row_index, row in df.iterrows():
        if row['contb_receipt_amt'] < 0:
            count += 1
    # for record in df['memo_text']:
        # if 'refund' in str(record).lower():
            # count += 1
    return count


def num_donors(df, state):
    """Return the number of people that have donated in the given state.
    
    Assume people have unique names (i.e. no two person share the same name).
    Do not count the same person twice.

    Args:
        df: A DataFrame generated from the campaign finance data csv file.
        state: The state of interest in capitalized two-letter format,
            e.g. "CA".

    Returns:
        An integer count of the number of donors.
    """
    # donors = set([])
    # df2 = df[['contbr_st', 'contbr_nm']]
    return len(df.drop_duplicates(['contbr_st', 'contbr_nm']))
    # for i in range(len(df)):
        # if df.ix[i]['contbr_st'] == state:
            # donors.add(str(df.ix[i]['contbr_nm']))
    # return len(donors)


def top_candidate_by_num_donors(df, state):
    """Find the candidate that received the most donations (by the number of
    donation records) in a given state.

    Args:
        df: A DataFrame generated from the campaign finance data csv file.
        state: The state of interest in capitalized two-letter format,
            e.g. "CA".

    Returns:
        A tuple consisting of a pair of values. The first value should be the
        name of the candidate, and the second value should be the fraction of
        the number of donations he received compared with all candidates.
        E.g. ('Cain, Herman', 0.115).
    """
    candDict = {}
    df2 = df[df['contbr_st'] == state]
    for row_index, row in df2.iterrows():
        if row['cand_nm'] not in candDict:
            candDict[row['cand_nm']] = 0
        candDict[row['cand_nm']] += 1
    
    
    maxContr = 0
    total = 0
    topCand = ''
    for cand in candDict:
        if candDict[cand] > maxContr:
            maxContr = candDict[cand]
            topCand = cand
        total += candDict[cand]
    return (topCand, (maxContr + 0.0) / total)
    
        
        


def top_candidate_by_amount(df, state):
    """Find the candidate that received the highest amount of donations in
    a given state.

    Args:
        df: A DataFrame generated from the campaign finance data csv file.
        state: The state of interest in capitalized two-letter format,
            e.g. "CA".

    Returns:
        A tuple consisting of a pair of values. The first value should be the
        name of the candidate, and the second value should be the fraction of
        donations he received compared with all candidates.
        E.g. ('Cain, Herman', 0.05).
    """
    candDict = {}
    df2 = df[df['contbr_st'] == state]
    for row_index, row in df2.iterrows():
        if row['cand_nm'] not in candDict:
            candDict[row['cand_nm']] = 0
        candDict[row['cand_nm']] += row['contb_receipt_amt']
    
    
    maxContr = 0
    total = 0
    topCand = ''
    for cand in candDict:
        if candDict[cand] > maxContr:
            maxContr = candDict[cand]
            topCand = cand
        total += candDict[cand]
    return (topCand, (maxContr + 0.0) / total)


def top_party_by_num_donors(df, state):
    """Find the party that received the most donations (by the number of
    donation records) in a given state.

    Args:
        df: A DataFrame generated from the campaign finance data csv file
            with the column "party" added.
        state: The state of interest in capitalized two-letter format,
            e.g. "CA".

    Returns:
        A tuple consisting of a pair of values. The first value should be the
        name of the party, as defined in add_party_column(df), and the second
        value should be the fraction of the number of donations the party
        received compared with other parties. E.g. ('Democrat', 0.115).
    """
    partyDict = {}
    df2 = df[df['contbr_st'] == state]
    for row_index, row in df2.iterrows():
        if row['party'] not in partyDict:
            partyDict[row['party']] = 0
        partyDict[row['party']] += 1
    
    
    maxContr = 0
    total = 0
    topParty = ''
    for party in partyDict:
        if partyDict[party] > maxContr:
            maxContr = partyDict[party]
            topParty = party
        total += partyDict[party]
    return (topParty, (maxContr + 0.0) / total)


def top_party_by_amount(df, state):
    """Find the party that received the highest amount of donations in a given
    state.

    Args:
        df: A DataFrame generated from the campaign finance data csv file
            with the column "party" added.
        state: The state of interest in capitalized two-letter format,
            e.g. "CA".

    Returns:
        Return a tuple consisting of a pair of values. The first value should be
        the name of the party, as defined in add_party_column(df), and the
        second value should be the fraction of the amount of donations the party
        received compared with other parties. E.g. ('Democrat', 0.21).
    """
    partyDict = {}
    df2 = df[df['contbr_st'] == state]
    for row_index, row in df2.iterrows():
        if row['party'] not in partyDict:
            partyDict[row['party']] = 0
        partyDict[row['party']] += row['contb_receipt_amt']
    
    
    maxContr = 0
    total = 0
    topCand = ''
    for cand in partyDict:
        if partyDict[cand] > maxContr:
            maxContr = partyDict[cand]
            topCand = cand
        total += partyDict[cand]
    return (topCand, (maxContr + 0.0) / total)


def num_bipartisan_donors(df):
    """Find the number of people that have donated to more than one parties.
    
    Args:
        df: A DataFrame generated from the campaign finance data csv file
            with the column "party" added.

    Returns:
        An integer count of the number of people that have donated to more than
        one parties.
    """
    donorDict = {}
    df2 = df.drop_duplicates(['contbr_nm', 'party'])[['contbr_nm', 'party']] #only uniques donors
    df3 = df2.drop_duplicates(['contbr_nm']) #drops people with same name across parties
    
    #num unique donors not across parties - num unique across parties = num donated to both
    return len(df2) - len(df3)


def bucketize_donation_amounts(df):
    """Generate a histogram for the donation amount.

    Put donation amount into buckets and generate a histogram for these buckets.
    The buckets are: (0, 1], (1, 10], (10, 100], (100, 1000], (1000, 10000],
    (10000, 100000], (100000, 1000000], (1000000, 10000000].

    Args:
        df: A DataFrame generated from the campaign finance data csv file.

    Returns:
        A list containing 8 integers. The Nth integer is the count of donation
        amounts that fall into the Nth bucket. E.g. [2, 3, 4, 5, 4, 3, 1, 1].
    """
    histogram = [0,0,0,0,0,0,0,0]
    for row_index, row in df.iterrows():
        donationAmount = row['contb_receipt_amt']
        if donationAmount > 0:
            histogram[(int)(math.floor(math.log(donationAmount) / math.log(10)))] += 1
    return histogram
    
    
def numObamaWins(df):
    count = 0
    states = df.drop_duplicates(['contbr_st'])
    for row_index, row in states.iterrows():
        if top_candidate_by_amount(df, row['contbr_st'])[0] == 'Obama, Barack':
            count += 1
    return count

def numRepWins(df):
    count = 0
    states = df.drop_duplicates(['contbr_st'])
    for row_index, row in states.iterrows():
        if top_party_by_amount(df, row['contbr_st'])[0] == 'Republican':
            count += 1
    return count
    
def refundsByCandidate(df):
    candDict = {}
    # df2 = df.drop_duplica
    for row_index, row in df.iterrows():
        if row['contb_receipt_amt'] < 0:
            if row['cand_nm'] not in candDict:
                candDict[row['cand_nm']] = 0
            candDict[row['cand_nm']] += 1
    return candDict
    
def mostGenerousState(df):
    stateDonationDict = {}
    for row_index, row in df.iterrows():
        if row['contbr_st'] not in stateDonationDict:
            stateDonationDict[row['contbr_st']] = 0
        stateDonationDict[row['contbr_st']] += row['contb_receipt_amt']
        
    maxState = ''
    maxDonationPerCapita = 0
    for state in stateDonationDict.keys():
        stateDonationDict[state] = stateDonationDict[state]/num_donors(df, state)
        if stateDonationDict[state] > maxDonationPerCapita:
            maxState = state
            maxDonationPerCapita = stateDonationDict[state]
    return maxState
        # print state, stateDonationDict[state]
    # print stateDonationDict.items()
    # return max(stateDonationDict, keys=stateDonationDict.get)
def averageDemocraticDonation(df):
    return df[df['party'] == 'Democrat']['contb_receipt_amt'].mean()
def averageRepublicanDonation(df):
    return df[df['party'] == 'Republican']['contb_receipt_amt'].mean()
def mostGenerousCity(df):
    cityDict = {}
    cityPop = {}
    for row_index, row in df.iterrows():
        city = row['contbr_city']
        if city not in cityDict:
            cityDict[city] = 0
            cityPop[city] = 0
        cityDict[city] += row['contb_receipt_amt']
        cityPop[city] += 1
    for city in cityDict.keys():
        cityDict[city] = cityDict[city] / cityPop[city]
    return max(cityDict, key=cityDict.get)
def mostGenerousOccupation(df):
    occDict = {}
    for row_index, row in df.iterrows():
        occupation = row['contbr_occupation']
        if occupation not in ['RETIRED', 'HOMEMAKER']:
            if occupation not in occDict:
                occDict[occupation] = 0
            occDict[occupation] += row['contb_receipt_amt']
    return max(occDict, key=occDict.get)
def mostGenerousEmployer(df):
    employerDict = {}
    for row_index, row in df.iterrows():
        employer = row['contbr_employer']
        if employer not in ['RETIRED', 'SELF-EMPLOYED', 'HOMEMAKER', 'INFORMATION REQUESTED PER BEST EFFORTS', 'SELF EMPLOYED', 'SELF', 'INFORMATION REQUESTED', 'NONE', 'NOT EMPLOYED', 'N/A', 'STUDENT']:
            if employer not in employerDict:
                employerDict[employer] = 0
            employerDict[employer] += row['contb_receipt_amt']
    return max(employerDict, key=employerDict.get)
# def top_party_by_amount(df, state):
    # df2 = df[df['party'] == 'Democrat']
# def donsBySize(df):
    # df2 = df[['party', 'contb_receipt_amt']]
    # df2 = df2[df2['contb_receipt_amt'] > 0]
    # df2 = df2.rename(columns={'contb_receipt_amt':'small'})
    # # print df2.to_string()
    
    # df3 = df2[df2['small'] <= 75]
    # df3 = df3.groupby('party').count().drop(['party'],axis=1)
    # df4 = df2[df2['small'] > 75]
    # df4 = df4.groupby('party').count()['small']
    # df3['large'] = df4
    
    # # df3.pivot('small','large')
    # # print df3.to_string()
    # # print df4.to_string()
    # return df3
def donsBySize(df):
    df2 = df[['party', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    df2 = df2.rename(columns={'contb_receipt_amt':'small'})
    # print df2.to_string()
    
    df3 = df2[df2['small'] <= 75]
    df3 = df3.groupby('party').count().drop(['party'],axis=1)
    df4 = df2[df2['small'] > 75]
    df4 = df4.groupby('party').count()['small']
    df3['large'] = df4
    df3 = df3.drop(['Libertarian'], axis=0)
    return df3
def contributors(df):
    df2 = df[['contbr_st', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    df2 = df2.groupby('contbr_st').sum()
    # df2 = df2.pivot('contbr_st','contb_receipt_amt')
    return df2
def donsByOccupation(df):
    df2 = df[['contbr_occupation', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    df2 = df2.groupby('contbr_occupation').sum()
    df2 = df2[df2['contb_receipt_amt'] > 5000]
    return df2
def numContributors(df):
    df2 = df[['contbr_st', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    df2 = df2.groupby('contbr_st').count().drop(['contbr_st'],axis=1)
    # df2 = df2.pivot('contbr_st','contb_receipt_amt')
    return df2
def donsByDate(df):
    df2 = df[['contb_receipt_dt', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    df2 = df2.groupby('contb_receipt_dt').count().drop(['contb_receipt_dt'],axis=1)
    # df2 = df2.pivot('contbr_st','contb_receipt_amt')
    return df2
def donsByCand(df):
    df2 = df[['cand_nm', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    df2 = df2.groupby('cand_nm').sum()
    # df2 = df2.pivot('contbr_st','contb_receipt_amt')
    return df2
def newData(df):
    df2 = df[['cand_nm', 'party', 'contb_receipt_dt', 'contbr_st', 'contb_receipt_amt']]
    df2 = df2[df2['contb_receipt_amt'] > 0]
    return df2
    
    
    

def main(*args):
    # df = read_csv('P00000001-ALL.txt')
    # df = read_csv('P00000001-CA.txt')
    # add_party_column(df)
    # newData(df).to_csv('../data/data.txt')
    df = read_csv('data/data.txt')
    # print contributors(df)
    # print donsBySize(df)
    # print numContributors(df)
    # print donsByDate(df)
    # print donsByCand(df)
    
    contributors(df).to_csv('preprocessed-data/contb.csv')
    donsBySize(df).to_csv('preprocessed-data/donsBySize.csv')
    numContributors(df).to_csv('preprocessed-data/numContb.csv')
    donsByDate(df).to_csv('preprocessed-data/donsByDate.csv')
    donsByCand(df).to_csv('preprocessed-data/donsByCand.csv')
    
    # hist = bucketize_donation_amounts(df)
    # stateHist = ''
    # for state in hist:
        # stateStr = state
        # for amt in hist[state]:
            # stateStr += ',' + str(amt)
        # stateHist = stateHist + stateStr + '\n'
    # print "state,bucket1,bucket2,bucket3,bucket4,bucket5,bucket6,bucket7,bucket8\n", stateHist
    # print "num donation records: ", num_donation_records(df)
    # print "num refund records: ", num_refund_records(df)
    # print "num donors: ", num_donors(df, 'CA')
    # print "top candidate by num donors: ",top_candidate_by_num_donors(df, 'CA')
    # print "top candidate by amount: ", top_candidate_by_amount(df, 'CA')
    # print "top party by num donors: ", top_party_by_num_donors(df, 'CA')
    # print "top party by amount: ", top_party_by_amount(df, 'CA')
    # print "num bipartisan donors: ", num_bipartisan_donors(df)
    # print "histogram of donation amounts: ", bucketize_donation_amounts(df)
    
    
    # uniqueDonors = df.drop_duplicates(['contbr_nm','contbr_city','contbr_st','contbr_zip','contbr_employer','contbr_occupation'])
    # uniqueNames = df.drop_duplicates(['contbr_nm'])
    # # print "Donors with duplicate names: ", uniqueDonors[[not x for x in uniqueDonors.duplicated(['contbr_nm'])]].to_string()
    # print "Possible number of duplicate names(# unique donors - # unique names): ", len(uniqueDonors) - len(uniqueNames)
    # print "Number of states Obama outfundraises Republican candidates in: ", numObamaWins(df)
    # print "Number of states Republicans outfundraise Democrats in: ", numRepWins(df)
    # candRefunds = refundsByCandidate(df)
    # print "Fewest refunds by candidate: ", min(candRefunds, key=candRefunds.get)
    # #mostgenerousstate takes 23 seconds?
    # # print "State with highest average donation: ", mostGenerousState(df)
    # print "Average donation amount for Democrats: ", averageDemocraticDonation(df)
    # print "Average donation amount for Republicans: ", averageRepublicanDonation(df)
    # print "Most generous city per capita: ", mostGenerousCity(df)
    # print "Occupation with highest total donations excluding retired: ", mostGenerousOccupation(df)
    # print "Employer with highest employee donations excluding those with no employers: ", mostGenerousEmployer(df)
    # # TODO: Put the code you used to explore the data set here.


if __name__ =='__main__':
    sys.exit(main(*sys.argv[1:]))

